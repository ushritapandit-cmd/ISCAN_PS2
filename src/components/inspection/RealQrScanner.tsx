import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useApp } from '../../context/AppContext';
import {
  parseQrCodeData,
  verifyQrCompliance,
  createInspectionFromQr,
  processProductQrScan,
  createInspectionFromLookup,
  ProductLookupResult,
  ParsedQrData,
  QrVerificationResult
} from '../../services/qrService';
import { saveRecentScan } from '../../services/recentScansService';
import { ProductResultCard } from './ProductResultCard';
import { DemoQrGeneratorModal } from './DemoQrGeneratorModal';
import {
  Camera,
  RefreshCw,
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  SwitchCamera,
  Layers,
  FileCheck2,
  Sparkles,
  ClipboardList,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Zap,
  ZapOff,
  Info,
  Smartphone,
  ScanLine,
  QrCode
} from 'lucide-react';

interface RealQrScannerProps {
  onClose?: () => void;
  onScanSuccess?: (result: QrVerificationResult) => void;
  initialMode?: 'camera' | 'upload';
  embedded?: boolean;
}

type ScannerStatus =
  | 'idle'
  | 'requesting-permission'
  | 'scanning'
  | 'detected'
  | 'processing'
  | 'result'
  | 'error';

interface CameraErrorDetails {
  title: string;
  message: string;
  isPermissionDenied?: boolean;
  isInsecureContext?: boolean;
  isIframe?: boolean;
  canRetry?: boolean;
}

export const RealQrScanner: React.FC<RealQrScannerProps> = ({
  onClose,
  onScanSuccess,
  initialMode = 'camera',
  embedded = false
}) => {
  const {
    currentUser,
    inspections,
    setActiveInspection,
    setActiveTab,
    addAuditLog
  } = useApp();

  const [status, setStatus] = useState<ScannerStatus>('idle');
  const [errorDetails, setErrorDetails] = useState<CameraErrorDetails | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [lastScannedText, setLastScannedText] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<QrVerificationResult | null>(null);
  const [lookupResult, setLookupResult] = useState<ProductLookupResult | null>(null);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [fileScanning, setFileScanning] = useState<boolean>(false);
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);

  const qrReaderIdRef = useRef<string>(`iscan-qr-reader-${Math.random().toString(36).substring(2, 9)}`);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const hasScannedRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play auditory click/beep feedback on scan
  const playScanBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // High C
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // Audio might be restricted by browser policy
    }

    // Gentle haptic feedback if supported on mobile device
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([40, 50, 40]);
      } catch {
        // Haptics ignore
      }
    }
  }, []);

  // Safe camera track and scanner shutdown
  const stopScanner = useCallback(async () => {
    console.log('[i-Scan QR] Stopping camera scanner and releasing MediaStream tracks...');
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('[i-Scan QR] Error stopping html5-qrcode instance:', err);
      }
      html5QrCodeRef.current = null;
    }
    isScanningRef.current = false;
    setTorchOn(false);
    setTorchSupported(false);
  }, []);

  // Check secure context requirements (HTTPS or localhost)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '[::1]';
      const secure = window.isSecureContext || window.location.protocol === 'https:' || isLocalhost;
      setIsSecure(secure);
      if (!secure) {
        console.warn('[i-Scan QR] Application is running on an insecure HTTP origin. Camera access will be blocked by browser.');
      }
    }
  }, []);

  // Handle scanned decoded text
  const handleDecodedText = useCallback(
    async (decodedText: string) => {
      // Prevent duplicate scan processing
      if (hasScannedRef.current) {
        console.log('[i-Scan QR] Duplicate scan ignored:', decodedText);
        return;
      }
      hasScannedRef.current = true;

      console.log('[i-Scan QR] QR detected successfully! Raw text:', decodedText);
      playScanBeep();

      // Immediately stop the live camera
      await stopScanner();
      setStatus('processing');
      setLastScannedText(decodedText);

      try {
        // 1. Process QR scan through dedicated product lookup and compliance service
        const lookup = processProductQrScan(decodedText);
        console.log('[i-Scan QR] Product lookup result:', lookup);
        setLookupResult(lookup);

        // 2. Also populate legacy verification result for backward compatibility
        const parsed = parseQrCodeData(decodedText);
        const result = verifyQrCompliance(parsed);
        setScanResult(result);

        setStatus('result');

        // 3. Automatically synthesize an active inspection and update context
        const inspectorName = currentUser?.name || 'Authorized Field Inspector';
        const inspectorId = currentUser?.id || 'usr-insp-1';
        const createdInspection = createInspectionFromLookup(
          lookup,
          inspectorName,
          inspectorId,
          inspections.length
        );
        setActiveInspection(createdInspection);

        // Record in recent scans repository history
        saveRecentScan(lookup, createdInspection.id);

        addAuditLog(
          'QR Code Scanned',
          'QR Scanner',
          createdInspection.id,
          `Decoded ${lookup.qr.dataType} from packaging. Matched: ${lookup.product ? lookup.product.productName : 'Unregistered Commodity'}. Status: ${lookup.complianceStatus}`
        );

        if (onScanSuccess) {
          onScanSuccess(result);
        }
      } catch (err: any) {
        console.error('[i-Scan QR] Error evaluating scanned QR:', err);
        setErrorDetails({
          title: 'QR Code Processing Error',
          message: 'The QR code was read, but could not be processed by the verification system. Please try again.',
          canRetry: true
        });
        setStatus('error');
      }
    },
    [currentUser, inspections.length, onScanSuccess, playScanBeep, setActiveInspection, stopScanner, addAuditLog]
  );

  // Start the real camera scanner
  const startCameraScanner = useCallback(
    async (overrideFacing?: 'environment' | 'user', overrideCameraId?: string) => {
      console.log('[i-Scan QR] Initializing camera scanner...');
      await stopScanner();
      setErrorDetails(null);
      setStatus('requesting-permission');
      hasScannedRef.current = false;

      // 1. Check secure context requirement
      if (typeof window !== 'undefined') {
        const isLocalhost =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';
        const secure = window.isSecureContext || window.location.protocol === 'https:' || isLocalhost;
        if (!secure) {
          console.error('[i-Scan QR] Camera blocked: Insecure Context');
          setErrorDetails({
            title: 'HTTPS Required for Camera Access',
            message:
              'Camera scanning requires a secure HTTPS connection according to browser security standards. Please access the application via HTTPS or localhost.',
            isInsecureContext: true,
            canRetry: false
          });
          setStatus('error');
          return;
        }
      }

      // 2. Check MediaDevices API support
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('[i-Scan QR] Camera API (navigator.mediaDevices.getUserMedia) is not supported');
        const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
        setErrorDetails({
          title: 'Camera Not Supported in Browser',
          message:
            'Your browser does not support the Web Camera API (navigator.mediaDevices.getUserMedia), or it has been restricted by iframe sandbox permissions.',
          isIframe: isInIframe,
          canRetry: false
        });
        setStatus('error');
        return;
      }

      const containerId = qrReaderIdRef.current;
      const targetFacing = overrideFacing || facingMode;
      const targetCameraId = overrideCameraId || selectedCameraId;

      try {
        console.log('[i-Scan QR] Requesting camera permission and initializing Html5Qrcode instance on element:', containerId);
        const html5Qr = new Html5Qrcode(containerId, {
          verbose: false
        });
        html5QrCodeRef.current = html5Qr;

        // Query available cameras to populate camera switch list
        try {
          const cameras = await Html5Qrcode.getCameras();
          console.log('[i-Scan QR] Available cameras discovered:', cameras);
          if (cameras && cameras.length > 0) {
            setAvailableCameras(cameras.map((c) => ({ id: c.id, label: c.label || `Camera ${c.id.substring(0, 5)}` })));
          }
        } catch (camListErr) {
          console.warn('[i-Scan QR] Could not enumerate cameras:', camListErr);
        }

        const scanConfig: Html5QrcodeCameraScanConfig = {
          fps: 12,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edge = Math.floor(minEdge * 0.72);
            return {
              width: Math.max(edge, 200),
              height: Math.max(edge, 200)
            };
          },
          aspectRatio: 1.0,
          disableFlip: false
        };

        const onScanSuccessCallback = (decodedText: string) => {
          handleDecodedText(decodedText);
        };

        const onScanFailureCallback = () => {
          // Normal: Frame analyzed but no QR code found. Silent.
        };

        // Multi-level camera startup strategy:
        // 1. Try selected device ID if specified
        // 2. Try facingMode (prefer environment / rear)
        // 3. Fallback to any camera
        let started = false;

        if (targetCameraId) {
          try {
            console.log('[i-Scan QR] Starting camera with exact device ID:', targetCameraId);
            await html5Qr.start(
              targetCameraId,
              scanConfig,
              onScanSuccessCallback,
              onScanFailureCallback
            );
            started = true;
          } catch (devErr) {
            console.warn('[i-Scan QR] Failed starting with target camera ID, falling back to facingMode:', devErr);
          }
        }

        if (!started) {
          try {
            console.log('[i-Scan QR] Starting camera with facingMode:', targetFacing);
            await html5Qr.start(
              { facingMode: targetFacing },
              scanConfig,
              onScanSuccessCallback,
              onScanFailureCallback
            );
            started = true;
          } catch (faceErr: any) {
            console.warn('[i-Scan QR] facingMode failed, falling back to default camera:', faceErr);
            // On desktop/laptop with only one camera, facingMode: environment can fail. Fall back to user or first camera.
            const oppositeMode = targetFacing === 'environment' ? 'user' : 'environment';
            try {
              await html5Qr.start(
                { facingMode: oppositeMode },
                scanConfig,
                onScanSuccessCallback,
                onScanFailureCallback
              );
              started = true;
              setFacingMode(oppositeMode);
            } catch (fallbackErr: any) {
              // Try starting with first available camera from getCameras
              const cams = await Html5Qrcode.getCameras();
              if (cams.length > 0) {
                await html5Qr.start(
                  cams[0].id,
                  scanConfig,
                  onScanSuccessCallback,
                  onScanFailureCallback
                );
                started = true;
              } else {
                throw fallbackErr;
              }
            }
          }
        }

        if (started) {
          console.log('[i-Scan QR] Camera successfully started. Live QR scanning active.');
          isScanningRef.current = true;
          setStatus('scanning');

          // Check if torch/flashlight is supported
          try {
            const capabilities = html5Qr.getRunningTrackCapabilities();
            if (capabilities && (capabilities as any).torch) {
              setTorchSupported(true);
            }
          } catch {
            // Torch check not supported
          }
        }
      } catch (err: any) {
        console.error('[i-Scan QR] Camera startup error:', err);
        const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
        const errName = err?.name || '';
        const errMsg = String(err?.message || err || '');

        let friendlyTitle = 'Camera Access Issue';
        let friendlyMessage = 'Camera access is required to scan a QR code. Please allow camera permission in your browser settings.';
        let isPermissionDenied = false;

        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errMsg.includes('Permission denied')) {
          friendlyTitle = 'Camera Permission Denied';
          friendlyMessage = 'Camera access is required to scan a QR code. Please allow camera permission in your browser settings.';
          isPermissionDenied = true;
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError' || errMsg.includes('No camera')) {
          friendlyTitle = 'No Camera Found';
          friendlyMessage = 'No camera device was detected on your system. You can scan by uploading an image of the QR code below.';
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError' || errMsg.includes('already in use')) {
          friendlyTitle = 'Camera In Use';
          friendlyMessage = 'The camera is currently being used by another application or tab. Please close other camera apps and press Try Again.';
        } else if (errName === 'OverconstrainedError') {
          friendlyTitle = 'Camera Constraint Error';
          friendlyMessage = 'The requested camera mode could not be opened. Please try switching cameras or use the image upload fallback.';
        }

        setErrorDetails({
          title: friendlyTitle,
          message: friendlyMessage,
          isPermissionDenied,
          isIframe: isInIframe,
          canRetry: true
        });
        setStatus('error');
        await stopScanner();
      }
    },
    [facingMode, handleDecodedText, selectedCameraId, stopScanner]
  );

  // Toggle facing mode (front vs rear)
  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    console.log('[i-Scan QR] Switching camera facingMode to:', nextMode);
    setFacingMode(nextMode);
    await startCameraScanner(nextMode);
  };

  // Switch specific camera device
  const handleSelectCamera = async (deviceId: string) => {
    console.log('[i-Scan QR] Switching to camera deviceId:', deviceId);
    setSelectedCameraId(deviceId);
    await startCameraScanner(facingMode, deviceId);
  };

  // Toggle torch / flash if supported
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !torchSupported) return;
    try {
      const nextTorch = !torchOn;
      await (html5QrCodeRef.current as any).applyVideoConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setTorchOn(nextTorch);
      console.log('[i-Scan QR] Torch set to:', nextTorch);
    } catch (err) {
      console.warn('[i-Scan QR] Torch toggle failed:', err);
    }
  };

  // Handle fallback file upload of a QR code image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('[i-Scan QR] Decoding QR code from uploaded image file:', file.name, file.size, file.type);
    setFileScanning(true);
    setErrorDetails(null);
    await stopScanner();

    const containerId = qrReaderIdRef.current;
    try {
      const html5Qr = new Html5Qrcode(containerId, { verbose: false });
      const decodedText = await html5Qr.scanFile(file, false);
      html5Qr.clear();
      console.log('[i-Scan QR] File decoded successfully:', decodedText);
      setFileScanning(false);
      handleDecodedText(decodedText);
    } catch (fileErr: any) {
      console.warn('[i-Scan QR] Could not find or decode QR code in image file:', fileErr);
      setFileScanning(false);
      setErrorDetails({
        title: 'QR Code Not Detected in Image',
        message: 'No readable QR code was found in the selected image. Please ensure the QR code is clear, well-lit, and in focus.',
        canRetry: true
      });
      setStatus('error');
    }

    // Reset input value so same file can be reselected
    e.target.value = '';
  };

  // Reset and restart scanner fresh
  const handleScanAgain = async () => {
    console.log('[i-Scan QR] User initiated Scan Again.');
    setScanResult(null);
    setLookupResult(null);
    setLastScannedText(null);
    setErrorDetails(null);
    hasScannedRef.current = false;
    await startCameraScanner();
  };

  // Initialize camera when mounted if in camera mode
  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      if (isMounted && initialMode === 'camera') {
        startCameraScanner();
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [initialMode, startCameraScanner, stopScanner]);

  // Navigate to full compliance analysis
  const handleProceedToCompliance = () => {
    setActiveTab('compliance');
    if (onClose) onClose();
  };

  // Navigate to physical multi-angle photo scanner
  const handleProceedToPackagingPhotos = () => {
    setActiveTab('scanner');
    if (onClose) onClose();
  };

  // Navigate to inspection report
  const handleProceedToReport = () => {
    setActiveTab('report');
    if (onClose) onClose();
  };

  return (
    <div
      id="iscan-real-qr-scanner-root"
      className={`relative w-full ${
        embedded ? 'max-w-4xl mx-auto' : 'p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto'
      } space-y-5`}
    >
      {/* Hidden file input for fallback scanning */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Commodity QR & Barcode Scanner
              </h2>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200">
                Live Field Camera
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Instant Legal Metrology commodity verification via GS1 Digital Link, E-Label QR, or GTIN.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setShowDemoModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-950 px-3.5 py-1.5 text-xs font-black text-emerald-300 hover:bg-emerald-900 cursor-pointer shadow-xs transition-colors"
          >
            <QrCode className="h-4 w-4 text-emerald-400" />
            <span>Hackathon Demo QR Codes</span>
          </button>

          {onClose && (
            <button
              onClick={() => {
                stopScanner();
                onClose();
              }}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Scanned Product Result Screen OR Live Camera Viewport */}
      {status === 'result' && lookupResult ? (
        <div className="space-y-4">
          {/* Keep hidden camera element in DOM for fast restart */}
          <div id={qrReaderIdRef.current} className="hidden" />

          <ProductResultCard
            result={lookupResult}
            onScanAgain={handleScanAgain}
            onScanPackageLabel={handleProceedToPackagingPhotos}
            onGenerateReport={handleProceedToReport}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Camera / Scanner Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative rounded-2xl border-2 border-slate-300 bg-slate-950 overflow-hidden shadow-md min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
            {/* Real Html5Qrcode video container (MUST be present in DOM) */}
            <div
              id={qrReaderIdRef.current}
              className={`w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center ${
                status === 'scanning' ? 'block' : status === 'processing' ? 'block opacity-40' : 'hidden'
              }`}
            />

            {/* Custom Overlay when Live Camera is Scanning */}
            {status === 'scanning' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10">
                {/* Top Overlay Bar */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Real Camera Active</span>
                    <span className="text-slate-400">•</span>
                    <span className="capitalize">{facingMode === 'environment' ? 'Rear' : 'Front'}</span>
                  </div>

                  {/* Top Controls: Torch & Camera Switch */}
                  <div className="flex items-center gap-1.5">
                    {torchSupported && (
                      <button
                        onClick={toggleTorch}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                          torchOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900/80 text-white hover:bg-slate-900'
                        }`}
                        title={torchOn ? 'Turn Flashlight Off' : 'Turn Flashlight On'}
                      >
                        {torchOn ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
                      </button>
                    )}

                    <button
                      onClick={toggleFacingMode}
                      className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                      title={`Switch Camera (Currently ${facingMode === 'environment' ? 'Rear' : 'Front'})`}
                    >
                      <SwitchCamera className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Centered Square Scanning Reticle Frame */}
                <div className="self-center relative w-60 h-60 sm:w-68 sm:h-68 pointer-events-none flex items-center justify-center">
                  {/* Four Corner Brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                  {/* Subtle Inner Box Frame */}
                  <div className="w-full h-full border border-emerald-400/20 rounded-lg bg-emerald-500/5 backdrop-blur-[1px]" />

                  {/* Animated Laser Scanning Line */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scan-laser" />

                  {/* Center Target Aim Dot */}
                  <div className="absolute h-2 w-2 rounded-full bg-emerald-400/70" />
                </div>

                {/* Bottom Instruction Pill */}
                <div className="self-center text-center pointer-events-auto">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur-md border border-white/10 shadow-lg">
                    <span>Point camera at the QR code on the packaging</span>
                  </div>
                </div>
              </div>
            )}

            {/* Requesting Permission / Initializing Spinner */}
            {status === 'requesting-permission' && (
              <div className="p-8 text-center text-slate-200 space-y-3 z-10">
                <RefreshCw className="h-10 w-10 mx-auto text-emerald-400 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Accessing Device Camera...</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Please allow camera permission when prompted by your browser.
                  </p>
                </div>
              </div>
            )}

            {/* Processing Scanned Code */}
            {status === 'processing' && (
              <div className="p-8 text-center text-slate-200 space-y-3 z-10">
                <RefreshCw className="h-10 w-10 mx-auto text-emerald-400 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Decoding QR Code...</p>
                  <p className="text-xs text-slate-400">
                    Extracting statutory Legal Metrology declarations
                  </p>
                </div>
              </div>
            )}

            {/* Success Result Viewport State */}
            {status === 'result' && scanResult && (
              <div className="p-6 text-center space-y-4 max-w-md mx-auto z-10">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10 animate-in zoom-in">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-1">
                  <span className="rounded-full bg-emerald-900/60 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 border border-emerald-500/30">
                    {scanResult.parsed.formatType}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white pt-1">
                    {scanResult.parsed.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono break-all line-clamp-2 px-2">
                    {scanResult.parsed.rawValue}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleScanAgain}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Scan Another QR Code</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error / Permission Denied State */}
            {status === 'error' && errorDetails && (
              <div className="p-6 text-center space-y-4 max-w-md mx-auto z-10">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-rose-500/20 text-rose-400 ring-8 ring-rose-500/10">
                  <AlertCircle className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">{errorDetails.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{errorDetails.message}</p>
                </div>

                {errorDetails.isPermissionDenied && (
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-left text-[11px] text-slate-300 space-y-1">
                    <p className="font-bold text-emerald-400">How to allow camera permission:</p>
                    <p>1. Tap the lock/tune icon 🔒 in your browser address bar.</p>
                    <p>2. Set "Camera" permission to "Allow".</p>
                    <p>3. Tap the "Try Again" button below.</p>
                  </div>
                )}

                {errorDetails.isInsecureContext && (
                  <div className="rounded-xl bg-amber-950/50 border border-amber-800/80 p-3 text-left text-[11px] text-amber-200 space-y-1">
                    <p className="font-bold text-amber-300">Security Notice:</p>
                    <p>Web browsers mandate HTTPS for live camera feeds. If testing locally, use localhost or a secure tunnel.</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {errorDetails.canRetry && (
                    <button
                      onClick={() => startCameraScanner()}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Try Again</span>
                    </button>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Upload QR Image Instead</span>
                  </button>
                </div>
              </div>
            )}

            {/* Idle state */}
            {status === 'idle' && (
              <div className="p-8 text-center text-slate-300 space-y-3 z-10">
                <Camera className="h-10 w-10 mx-auto text-emerald-400" />
                <p className="text-sm font-bold text-white">QR Code Scanner Ready</p>
                <button
                  onClick={() => startCameraScanner()}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md cursor-pointer"
                >
                  Start Camera
                </button>
              </div>
            )}
          </div>

          {/* Bottom Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              {status === 'scanning' ? (
                <>
                  <button
                    onClick={stopScanner}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Pause Camera
                  </button>

                  {/* Device selector if multiple cameras detected */}
                  {availableCameras.length > 1 && (
                    <select
                      value={selectedCameraId}
                      onChange={(e) => handleSelectCamera(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 cursor-pointer"
                    >
                      {availableCameras.map((cam, idx) => (
                        <option key={cam.id} value={cam.id}>
                          {cam.label || `Camera ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              ) : (
                <button
                  onClick={() => startCameraScanner()}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
                >
                  <Camera className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{status === 'result' ? 'Scan Another' : 'Start Camera'}</span>
                </button>
              )}

              {/* Fallback upload image button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={fileScanning}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                title="Select image containing QR code from your device"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>{fileScanning ? 'Scanning File...' : 'Upload QR Image'}</span>
              </button>
            </div>

            {/* Quick Helper text */}
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-slate-400" />
              <span>Supports GS1, URLs & EAN codes</span>
            </div>
          </div>
        </div>

        {/* Right Column: Decoded Information & Compliance Findings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {scanResult ? (
            /* Scanned Result Card */
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      scanResult.complianceState === 'COMPLIANT'
                        ? 'bg-emerald-500 ring-4 ring-emerald-100'
                        : scanResult.complianceState === 'NEEDS_REVIEW'
                        ? 'bg-amber-500 ring-4 ring-amber-100'
                        : 'bg-rose-500 ring-4 ring-rose-100'
                    }`}
                  />
                  <h3 className="font-bold text-sm text-slate-900">Decoded Commodity Data</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    scanResult.complianceState === 'COMPLIANT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : scanResult.complianceState === 'NEEDS_REVIEW'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {scanResult.complianceState.replace('_', ' ')}
                </span>
              </div>

              {/* Matched Product Banner if found in catalog */}
              {scanResult.matchedPreset ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-900 text-xs">
                      Registered Commodity Match
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-semibold">
                      {scanResult.matchedPreset.barcode}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{scanResult.matchedPreset.name}</p>
                  <p className="text-[11px] text-slate-600">{scanResult.matchedPreset.manufacturer}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs space-y-1">
                  <span className="font-bold text-blue-900 text-xs">New Commodity Field Entry</span>
                  <p className="text-[11px] text-blue-800">
                    Decoded via live QR stream. Initialized Legal Metrology verification form.
                  </p>
                </div>
              )}

              {/* Decoded Attribute Table */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">QR Format</span>
                  <span className="font-mono font-bold text-slate-800">{scanResult.parsed.formatType}</span>
                </div>

                {scanResult.parsed.barcode && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Barcode / GTIN</span>
                    <span className="font-mono font-bold text-emerald-700">{scanResult.parsed.barcode}</span>
                  </div>
                )}

                {scanResult.parsed.batchNumber && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Batch / Lot</span>
                    <span className="font-mono text-slate-800">{scanResult.parsed.batchNumber}</span>
                  </div>
                )}

                {scanResult.parsed.expiryDate && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Expiry Date</span>
                    <span className="font-semibold text-slate-800">{scanResult.parsed.expiryDate}</span>
                  </div>
                )}

                {scanResult.parsed.url && (
                  <div className="py-1 border-b border-slate-100">
                    <span className="text-slate-500 block mb-0.5">Decoded URL</span>
                    <a
                      href={scanResult.parsed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-blue-600 hover:underline break-all inline-flex items-center gap-1"
                    >
                      <span>{scanResult.parsed.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Screening Score</span>
                  <span className="font-bold text-slate-900">{scanResult.evaluation.screeningScore}%</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Rule Engine Verdict</span>
                  <span className="font-semibold text-slate-800">
                    {scanResult.evaluation.passedCount} Pass • {scanResult.evaluation.violationsCount} Violations
                  </span>
                </div>
              </div>

              {/* Raw Payload Collapsible / Info Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Raw QR Content
                </span>
                <p className="text-[11px] font-mono text-slate-700 break-all leading-relaxed max-h-20 overflow-y-auto">
                  {scanResult.parsed.rawValue}
                </p>
              </div>

              {/* Action Buttons for Next Inspection Steps */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleProceedToCompliance}
                  className="w-full rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileCheck2 className="h-4 w-4" />
                  <span>View Full Compliance Analysis</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={handleProceedToPackagingPhotos}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Camera className="h-3.5 w-3.5 text-slate-500" />
                  <span>Capture Multi-Angle Label Photos</span>
                </button>
              </div>
            </div>
          ) : (
            /* Awaiting Scan Placeholder & Guide */
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Statutory QR Code Verification</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Under the Legal Metrology (Packaged Commodities) Rules, 2011 and recent amendments, commodity QR codes provide essential manufacturer disclosures, E-labels, and batch traceability.
              </p>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">GS1 Digital Link:</strong> Automatically decodes GTIN, batch number, and manufacturing dates.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">E-commerce / E-label URL:</strong> Verifies consumer disclosure links against Rule 6(10).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Commodity Barcode / EAN:</strong> Instant lookup in registered Legal Metrology repository.
                  </span>
                </div>
              </div>

              {/* Hackathon Demo Codes & Test Codes */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="rounded-xl border-2 border-emerald-400 bg-emerald-950 p-3 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      ⚡ HACKATHON DEMO PRODUCTS
                    </span>
                    <button
                      onClick={() => setShowDemoModal(true)}
                      className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase cursor-pointer transition-colors"
                    >
                      View QR Codes
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                    Point your real camera at the generated QR codes or click below for instant decoder simulation:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 pt-1">
                    <button
                      onClick={() => handleDecodedText('ISCAN-LAYS-001')}
                      className="text-left rounded-lg bg-emerald-900/70 border border-emerald-700/80 p-2 hover:bg-emerald-800 transition-colors text-[11px] cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white">🟢 Lay's Classic Salted</p>
                        <span className="text-[9px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                          COMPLIANT
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-emerald-300 truncate">QR: ISCAN-LAYS-001</p>
                    </button>

                    <button
                      onClick={() => handleDecodedText('ISCAN-KURKURE-001')}
                      className="text-left rounded-lg bg-rose-950/70 border border-rose-700/80 p-2 hover:bg-rose-900 transition-colors text-[11px] cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white">🔴 Kurkure Masala Munch</p>
                        <span className="text-[9px] bg-rose-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                          NON-COMPLIANT
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-rose-300 truncate">QR: ISCAN-KURKURE-001 (Missing helpline)</p>
                    </button>

                    <button
                      onClick={() => handleDecodedText('ISCAN-UNREGISTERED-999')}
                      className="text-left rounded-lg bg-slate-900 border border-slate-700 p-2 hover:bg-slate-800 transition-colors text-[11px] cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-200">⚪ Unknown / Unregistered QR</p>
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                          NOT IN DB
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 truncate">QR: ISCAN-UNREGISTERED-999</p>
                    </button>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pt-1">
                  Standard Catalog Test Codes (Click to test decoder)
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    {
                      label: 'Ananda Butter Biscuits (Compliant GS1)',
                      val: 'https://id.gs1.org/01/08901030829102/10/BATCH2026/17/261231'
                    },
                    {
                      label: 'Brahmaputra Valley Tea (Missing Consumer Helpline)',
                      val: 'https://id.gs1.org/01/08904018290123/10/LOT889'
                    },
                    {
                      label: 'Fortune Kachi Ghani Mustard Oil (EAN-13 Barcode)',
                      val: '8902091823901'
                    }
                  ].map((testCase) => (
                    <button
                      key={testCase.label}
                      onClick={() => handleDecodedText(testCase.val)}
                      className="text-left rounded-lg border border-slate-200 p-2 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors text-[11px] cursor-pointer"
                    >
                      <p className="font-semibold text-slate-800 truncate">{testCase.label}</p>
                      <p className="font-mono text-[10px] text-slate-500 truncate">{testCase.val}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Demo QR Generator Modal */}
      <DemoQrGeneratorModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectCode={(code) => {
          setShowDemoModal(false);
          handleDecodedText(code);
        }}
      />
    </div>
  );
};
