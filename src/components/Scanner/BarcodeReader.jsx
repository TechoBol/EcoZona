import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function BarcodeReader({ onDetected, onClose }) {
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    scannedRef.current = false;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const devices = await Html5Qrcode.getCameras();

        const backCamera =
          devices.find((d) =>
            d.label.toLowerCase().includes("back")
          ) || devices[0];

        await html5QrCode.start(
          backCamera.id,
          {
            fps: 30, // 🔥 MÁXIMA VELOCIDAD
            qrbox: { width: 9999, height: 9999 }, // 🔥 TODA LA PANTALLA
            aspectRatio: 1.777,

            videoConstraints: {
              facingMode: "environment",
              width: { ideal: 1920 },
              height: { ideal: 1080 },

              // 🔥 CONFIG PRO
              focusMode: "continuous",
              exposureMode: "continuous",
              whiteBalanceMode: "continuous",
            },
          },

          (decodedText) => {
            if (!scannedRef.current) {
              scannedRef.current = true;

              navigator.vibrate?.(200);

              stopScanner();

              onDetected(decodedText);
              onClose();
            }
          },

          () => {
            // ignoramos errores (modo agresivo)
          }
        );

        isRunningRef.current = true;

        // 🔍 AUTO ZOOM AGRESIVO
        setTimeout(() => {
          try {
            const track = html5QrCode.getRunningTrack();
            const caps = track.getCapabilities();

            if (caps.zoom) {
              track.applyConstraints({
                advanced: [{ zoom: caps.zoom.max }],
              });
            }
          } catch {}
        }, 500);
      } catch (err) {
        console.error("Error cámara:", err);
      }
    };

    const stopScanner = async () => {
      try {
        if (scannerRef.current && isRunningRef.current) {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
          isRunningRef.current = false;
        }
      } catch {}
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        id="reader"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* 🎯 PUNTO CENTRAL (tipo supermercado) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80%",
          height: "2px",
          background: "red",
          transform: "translate(-50%, -50%)",
          opacity: 0.7,
        }}
      />

      {/* BOTÓN */}
      <button
        onClick={() => {
          if (scannerRef.current) {
            scannerRef.current
              .stop()
              .then(() => scannerRef.current.clear())
              .catch(() => {});
          }
          onClose();
        }}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default BarcodeReader;