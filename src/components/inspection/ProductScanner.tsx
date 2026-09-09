import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Layers,
  Eye,
  SwitchCamera,
  Zap,
  ZapOff,
  ExternalLink,
  Smartphone,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  ScanLine,
  QrCode
} from 'lucide-react';
import { ProductImage } from '../../types';
import { DEMO_PRESETS } from '../../data/demoProducts';
import { ImageProcessingAnimation } from './ImageProcessingAnimation';
import { RealQrScanner } from './RealQrScanner';

interface CameraErrorState {
  message: string;
  code?: string;
  isIframe?: boolean;
}

export const ProductScanner: React.FC = () => {
  const { activeInspection, updateActiveInspection, setActiveTab, selectedPreset, startNewInspection } = useApp();

  const [activeAngle, setActiveAngle] = useState<'front' | 'back' | 'side' | 'top_bottom'>('front');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStarting, setCameraStarting] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<CameraErrorState | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [torchSupported, setTorchSupported] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [shutterAnimation, setShutterAnimation] = useState<boolean>(false);
  const [cameraResolution, setCameraResolution] = useState<string>('');
  const [scannerMode, setScannerMode] = useState<'camera' | 'qr'>('camera');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const directCaptureInputRef = useRef<HTMLInputElement | null>(null);

  const currentImages = activeInspection?.images || [];
  const currentAngleImage = currentImages.find((img) => img.type === activeAngle) || currentImages[0];

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop error:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraStarting(false);
    setTorchOn(false);
    setTorchSupported(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Attach stream to video element when isCameraActive changes and video mounts
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      video.muted = true;
      video.playsInline = true;
      video.play().catch((e) => {
        console.warn('Video auto-play warning:', e);
      });
    }
  }, [isCameraActive]);

  // Start Camera with multi-level fallback constraints
  const startCamera = async (overrideFacingMode?: 'environment' | 'user', overrideDeviceId?: string) => {
    setCameraStarting(true);
    setCameraError(null);
    stopCamera();

    const targetFacing = overrideFacingMode || facingMode;
    const targetDeviceId = overrideDeviceId || selectedDeviceId;

    try {
      // Check if MediaDevices API is supported
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
        setCameraError({
          message: 'The browser Camera API (navigator.mediaDevices.getUserMedia) is not accessible in this context.',
          code: 'NOT_SUPPORTED',
          isIframe: isInIframe
        });
        setCameraStarting(false);
        return;
      }

      // Build progressive fallback constraint attempts
      const attempts: MediaStreamConstraints[] = [];

      if (targetDeviceId) {
        attempts.push({
          video: { deviceId: { exact: targetDeviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        });
        attempts.push({
          video: { deviceId: { exact: targetDeviceId } },
          audio: false
        });
      }

      // 1. Target facing mode with ideal 1080p resolution
      attempts.push({
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      // 2. Exact/simple facing mode
      attempts.push({
        video: { facingMode: targetFacing },
        audio: false
      });

      // 3. Fallback: Any available video device
      attempts.push({
        video: true,
        audio: false
      });

      let acquiredStream: MediaStream | null = null;
      let lastErr: any = null;

      for (const constraint of attempts) {
        try {
          acquiredStream = await navigator.mediaDevices.getUserMedia(constraint);
          if (acquiredStream) {
            break;
          }
        } catch (err: any) {
          lastErr = err;
          // Continue to next fallback constraint
        }
      }

      if (!acquiredStream) {
        throw lastErr || new Error('No camera stream could be initialized');
      }

      streamRef.current = acquiredStream;

      // Update available camera device list if possible
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableCameras(videoInputs);
      } catch (devErr) {
        console.warn('enumerateDevices error:', devErr);
      }

      // Check capabilities for torch/flash
      try {
        const videoTrack = acquiredStream.getVideoTracks()[0];
        if (videoTrack && typeof (videoTrack as any).getCapabilities === 'function') {
          const capabilities = (videoTrack as any).getCapabilities();
          if (capabilities.torch) {
            setTorchSupported(true);
          }
        }
      } catch (capErr) {
        console.warn('Capability check error:', capErr);
      }

      setIsCameraActive(true);
      setCameraStarting(false);
    } catch (err: any) {
      console.error('Camera startup failure:', err);
      const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
      let message = 'Camera access denied or unavailable.';
      const code = err?.name || 'UNKNOWN';

      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        message = 'Camera permission was denied. Please allow camera access in your browser address bar or device settings.';
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        message = 'No camera device found on this system. You can snap with mobile camera or upload an image file.';
      } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
        message = 'Camera is already in use by another tab or app. Please close other applications using your webcam.';
      } else if (err?.name === 'OverconstrainedError') {
        message = 'Camera does not support the requested video resolution.';
      } else if (err?.name === 'SecurityError') {
        message = 'Camera access was blocked due to iframe security policy.';
      }

      setCameraError({ message, code, isIframe: isInIframe });
      setCameraStarting(false);
      setIsCameraActive(false);
    }
  };

  // Toggle front vs back camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(nextMode);
    }
  };

  // Toggle hardware torch if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setTorchOn(nextState);
      } catch (err) {
        console.warn('Failed to toggle torch:', err);
      }
    }
  };

  // Capture photo from live video feed
  const capturePhoto = () => {
    if (!videoRef.current) return;

    // Trigger visual shutter flash
    setShutterAnimation(true);
    setTimeout(() => setShutterAnimation(false), 220);

    // Audio click feedback via Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {
      // Audio context ignored if restricted
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      const angleLabel =
        activeAngle === 'front'
          ? 'Front PDP'
          : activeAngle === 'back'
          ? 'Back Info Panel'
          : activeAngle === 'side'
          ? 'Side Label'
          : 'Top/Bottom Seal';

      const newImage: ProductImage = {
        id: `img-${Date.now()}`,
        type: activeAngle,
        url: dataUrl,
        name: `Captured_${activeAngle}_${Date.now()}.jpg`,
        qualityScore: 95,
        resolution: `${canvas.width}x${canvas.height}`
      };

      const updated = currentImages.filter((img) => img.type !== activeAngle).concat(newImage);
      updateActiveInspection({ images: updated });
      stopCamera();

      // Automatically advance to the next empty angle if available
      const angleOrder: Array<'front' | 'back' | 'side' | 'top_bottom'> = ['front', 'back', 'side', 'top_bottom'];
      const currentIndex = angleOrder.indexOf(activeAngle);
      const nextAngle = angleOrder.find((a, idx) => idx > currentIndex && !updated.some((img) => img.type === a));
      if (nextAngle) {
        setActiveAngle(nextAngle);
      }
    }
  };

  // Handle uploaded or direct mobile camera captured image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Extract image dimensions using temporary Image object
      const tempImg = new window.Image();
      tempImg.onload = () => {
        const newImage: ProductImage = {
          id: `img-${Date.now()}`,
          type: activeAngle,
          url: dataUrl,
          name: file.name || `Upload_${activeAngle}.jpg`,
          qualityScore: 94,
          resolution: `${tempImg.naturalWidth}x${tempImg.naturalHeight}`
        };

        const updated = currentImages.filter((img) => img.type !== activeAngle).concat(newImage);
        updateActiveInspection({ images: updated });

        // Reset file input so re-selecting same file works
        e.target.value = '';
      };
      tempImg.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Load sample authentic package photo for testing without camera hardware
  const handleLoadSamplePhoto = () => {
    const targetPreset = selectedPreset || DEMO_PRESETS[1];
    const match = targetPreset.images.find((img) => img.type === activeAngle) || targetPreset.images[0];
    if (match) {
      const newImage: ProductImage = {
        ...match,
        id: `img-sample-${Date.now()}`
      };
      const updated = currentImages.filter((img) => img.type !== activeAngle).concat(newImage);
      updateActiveInspection({ images: updated });
    }
  };

  const handleRemoveImage = () => {
    const updated = currentImages.filter((img) => img.type !== activeAngle);
    updateActiveInspection({ images: updated });
  };

  const handleStartAnalysis = () => {
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setActiveTab('ocr');
  };

  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    }
  };

  if (isProcessing) {
    return <ImageProcessingAnimation onComplete={handleProcessingComplete} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Scan Packaged Commodity
            </h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 border border-emerald-200">
              Live Field Camera
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Inspection ID: <span className="font-mono font-bold text-slate-800">{activeInspection?.id}</span> — {activeInspection?.productName}
          </p>
        </div>

        {/* Quick Demo Scenario Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPreset?.id || ''}
            onChange={(e) => {
              const match = DEMO_PRESETS.find((p) => p.id === e.target.value);
              if (match) startNewInspection(match);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {DEMO_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                Demo Preset: {p.name} ({p.badgeTag})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scanner Mode Selector Bar: Packaging Camera vs Real QR Scanner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
          <button
            onClick={() => setScannerMode('camera')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              scannerMode === 'camera'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="h-4 w-4 text-emerald-600" />
            <span>Packaging Label Camera</span>
          </button>
          <button
            onClick={() => {
              stopCamera();
              setScannerMode('qr');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              scannerMode === 'qr'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScanLine className="h-4 w-4 text-emerald-600" />
            <span>Real QR Code Scanner</span>
          </button>
        </div>

        {scannerMode === 'camera' ? (
          <button
            onClick={() => {
              stopCamera();
              setScannerMode('qr');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg cursor-pointer self-start sm:self-auto"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Switch to Real QR Scanner</span>
          </button>
        ) : (
          <button
            onClick={() => setScannerMode('camera')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <Camera className="h-3.5 w-3.5 text-slate-500" />
            <span>Back to Packaging Photos</span>
          </button>
        )}
      </div>

      {scannerMode === 'qr' ? (
        <RealQrScanner embedded={true} />
      ) : (
        <>
          {/* Camera Alert / Error diagnostic banner if any */}
      {cameraError && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-3 shadow-xs">
          <div className="flex items-start gap-3 text-xs text-amber-950">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                <span>Camera Notice:</span>
                {cameraError.code && (
                  <span className="font-mono text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">
                    {cameraError.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">{cameraError.message}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/70 pl-8">
            <button
              onClick={() => startCamera()}
              className="rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-800 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Camera</span>
            </button>

            {cameraError.isIframe && (
              <button
                onClick={openInNewTab}
                className="rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100/50 shadow-2xs cursor-pointer flex items-center gap-1.5"
                title="If iframe security blocks camera, open in standalone tab"
              >
                <ExternalLink className="h-3.5 w-3.5 text-amber-700" />
                <span>Open in Full Tab</span>
              </button>
            )}

            <button
              onClick={() => directCaptureInputRef.current?.click()}
              className="rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100/50 shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Smartphone className="h-3.5 w-3.5 text-amber-700" />
              <span>Use Mobile Camera</span>
            </button>

            <button
              onClick={handleLoadSamplePhoto}
              className="rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100/50 shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <ImageIcon className="h-3.5 w-3.5 text-amber-700" />
              <span>Load Sample Packaging Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Viewport / Live Stream / Image Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl border-2 border-slate-300 bg-slate-950 overflow-hidden min-h-[420px] max-h-[500px] flex items-center justify-center shadow-md">
            {/* Live Camera Feed */}
            {isCameraActive ? (
              <div className="relative w-full h-full min-h-[420px] flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play().catch(console.warn);
                      setCameraResolution(`${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
                    }
                  }}
                  className="w-full h-full object-cover min-h-[420px]"
                />

                {/* Shutter White Flash Animation */}
                {shutterAnimation && (
                  <div className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 z-30" />
                )}

                {/* Viewport Reticle / Legal Metrology Alignment Guidelines */}
                <div className="absolute inset-6 pointer-events-none border-2 border-emerald-400/80 rounded-xl border-dashed flex flex-col justify-between p-3 z-10">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider bg-slate-900/80 px-2.5 py-1 rounded backdrop-blur-xs border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Align {activeAngle === 'front' ? 'Principal Display Panel' : `${activeAngle.toUpperCase()} Panel`} Inside Frame</span>
                    </div>

                    {cameraResolution && (
                      <span className="text-[10px] font-mono text-emerald-300 bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {cameraResolution}
                      </span>
                    )}
                  </div>

                  {/* Center Alignment Crosshairs */}
                  <div className="self-center flex items-center justify-center opacity-40 pointer-events-none">
                    <div className="w-10 h-10 border border-emerald-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-emerald-300/90 font-mono bg-slate-900/80 px-2.5 py-1 rounded backdrop-blur-xs border border-emerald-500/30">
                    <span>ASPECT RATIO 4:3 • OCR HIGH-RES</span>
                    <span>RULE 6/7/8 PDP CALIBRATED</span>
                  </div>
                </div>

                {/* Floating On-Screen Camera Controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  {torchSupported && (
                    <button
                      onClick={toggleTorch}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        torchOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900/70 text-white hover:bg-slate-900'
                      }`}
                      title={torchOn ? 'Turn Flash Off' : 'Turn Flash On'}
                    >
                      {torchOn ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
                    </button>
                  )}

                  <button
                    onClick={toggleFacingMode}
                    className="p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 backdrop-blur-md transition-colors cursor-pointer"
                    title={`Switch Camera (Currently ${facingMode === 'environment' ? 'Rear' : 'Front'})`}
                  >
                    <SwitchCamera className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : cameraStarting ? (
              /* Loading Spinner while starting camera */
              <div className="p-8 text-center text-slate-300 space-y-3">
                <Loader2 className="h-10 w-10 mx-auto text-emerald-400 animate-spin" />
                <p className="text-sm font-semibold">Initializing Camera Stream...</p>
                <p className="text-xs text-slate-400">Requesting device video access and setting resolution</p>
              </div>
            ) : currentAngleImage ? (
              /* Display Captured/Selected Angle Image */
              <div className="relative w-full h-full flex items-center justify-center p-4 bg-slate-900">
                <img
                  src={currentAngleImage.url}
                  alt={currentAngleImage.name}
                  className="max-h-[420px] w-auto object-contain rounded-lg shadow-xl"
                />
                {/* Image Specs Overlay */}
                <div className="absolute top-3 left-3 rounded-md bg-slate-900/85 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs border border-white/10 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="capitalize font-bold">{currentAngleImage.type} View</span>
                  <span className="text-slate-400">•</span>
                  <span>{currentAngleImage.resolution}</span>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="p-8 text-center text-slate-400 space-y-3">
                <Camera className="h-12 w-12 mx-auto text-slate-600 animate-pulse" />
                <p className="text-sm font-semibold text-slate-300">No image captured for this angle yet</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click <strong className="text-slate-400 font-bold">Take Photo</strong> to start your camera, use <strong className="text-slate-400 font-bold">Mobile Camera</strong>, or upload a packaging photo.
                </p>
              </div>
            )}
          </div>

          {/* Capture Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              {isCameraActive ? (
                <>
                  <button
                    onClick={capturePhoto}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all cursor-pointer ring-2 ring-emerald-400/50"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Capture Photo</span>
                  </button>

                  <button
                    onClick={stopCamera}
                    className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel Camera
                  </button>

                  {/* Device selector if multiple cameras detected */}
                  {availableCameras.length > 1 && (
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => {
                        setSelectedDeviceId(e.target.value);
                        startCamera(facingMode, e.target.value);
                      }}
                      className="rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-700"
                    >
                      {availableCameras.map((cam, idx) => (
                        <option key={cam.deviceId} value={cam.deviceId}>
                          {cam.label || `Camera ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => startCamera()}
                    disabled={cameraStarting}
                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm cursor-pointer disabled:opacity-60 transition-all"
                  >
                    {cameraStarting ? (
                      <Loader2 className="h-4 w-4 text-emerald-400 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 text-emerald-400" />
                    )}
                    <span>{cameraStarting ? 'Starting Camera...' : 'Take Photo (Live Camera)'}</span>
                  </button>

                  {/* Native Mobile Camera Snap */}
                  <button
                    onClick={() => directCaptureInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 shadow-2xs cursor-pointer transition-all"
                    title="Directly opens native phone or tablet camera app"
                  >
                    <Smartphone className="h-4 w-4 text-emerald-600" />
                    <span>Mobile Snap</span>
                  </button>

                  {/* Upload Image File */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
                  >
                    <Upload className="h-4 w-4 text-slate-500" />
                    <span>Upload Image</span>
                  </button>

                  {/* Quick Sample Photo fallback */}
                  <button
                    onClick={handleLoadSamplePhoto}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                    title="Load sample packaging artwork for fast testing without camera"
                  >
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                    <span>Load Sample</span>
                  </button>
                </>
              )}
            </div>

            {/* Direct mobile capture input element */}
            <input
              type="file"
              ref={directCaptureInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {/* Retake and Remove buttons for captured photo */}
            {currentAngleImage && !isCameraActive && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startCamera()}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  title="Retake image with camera"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="rounded-xl border border-slate-200 p-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Multi-Angle Views Selector & Packaging Metadata (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Multi-Angle Selectors */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                <span>Package Views (Multi-Angle)</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {currentImages.length} captured
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Legal Metrology checks mandatory declarations across all panels (PDP, Information Panel, crimp seals).
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {[
                { type: 'front' as const, label: 'Front Panel (PDP)', desc: 'Generic name, Net Qty' },
                { type: 'back' as const, label: 'Back Information', desc: 'MRP, Mfg address, Care' },
                { type: 'side' as const, label: 'Side / Flap', desc: 'Batch, Barcode, FSSAI' },
                { type: 'top_bottom' as const, label: 'Top / Bottom Seal', desc: 'Date stamp, Price crimp' }
              ].map((angle) => {
                const img = currentImages.find((i) => i.type === angle.type);
                const isSelected = activeAngle === angle.type;

                return (
                  <button
                    key={angle.type}
                    onClick={() => {
                      if (isCameraActive) stopCamera();
                      setActiveAngle(angle.type);
                    }}
                    className={`text-left rounded-xl border p-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{angle.label}</span>
                      {img ? (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" title="Image captured" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-300" title="Pending" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{angle.desc}</p>
                    <div className="mt-2 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
                      <span>{img ? '✓ Ready for OCR' : 'Click to capture'}</span>
                      {img && <span className="text-emerald-700 font-bold">{img.resolution}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Details Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Commodity Manifest
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Commodity Name</span>
                <span className="font-bold text-slate-900">{activeInspection?.productName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-800">{activeInspection?.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Manufacturer / Packer</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={activeInspection?.manufacturer}>
                  {activeInspection?.manufacturer}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Barcode / EAN</span>
                <span className="font-mono text-slate-700">{activeInspection?.barcode}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Inspector Terminal</span>
                <span className="font-semibold text-slate-700">{activeInspection?.inspectorName}</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Analyze Product */}
          <button
            onClick={handleStartAnalysis}
            className="w-full rounded-xl bg-emerald-600 py-3.5 px-4 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="h-5 w-5" />
            <span>Analyze Product (Run OCR & Rule Engine)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
