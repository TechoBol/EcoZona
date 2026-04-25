import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function MultiBarCodeReader({ onDetected, onClose }) {
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    scannedRef.current = false;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader-multi");
        scannerRef.current = html5QrCode;

        const devices = await Html5Qrcode.getCameras();

        const backCamera =
          devices.find((d) =>
            d.label.toLowerCase().includes("back")
          ) || devices[0];

        await html5QrCode.start(
          backCamera.id,
          {
            fps: 30,
            qrbox: { width: 9999, height: 9999 },
            aspectRatio: 1.777,
          },

          (decodedText) => {
            if (scannedRef.current) return;

            scannedRef.current = true;

            navigator.vibrate?.(100);

            onDetected(decodedText);

            // 🔥 permite escanear otra vez
            setTimeout(() => {
              scannedRef.current = false;
            }, 800);
          }
        );

        isRunningRef.current = true;
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
      <div id="reader-multi" style={{ width: "100%", height: "100%" }} />

      {/* botón cerrar */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default MultiBarCodeReader;