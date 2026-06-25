"use client";

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSignatureChange: (signatureBase64: string | null) => void;
}

export default function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
    onSignatureChange(null);
  };

  const handleSave = () => {
    if (sigCanvas.current?.isEmpty()) {
      setIsEmpty(true);
      onSignatureChange(null);
      return;
    }
    setIsEmpty(false);
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataUrl) {
      onSignatureChange(dataUrl);
    }
  };

  const handleEnd = () => {
    setIsEmpty(false);
    handleSave();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full bg-white rounded-xl border-2 border-dashed border-gray-300 overflow-hidden touch-none h-48">
        {mounted && (
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              className: "signature-canvas w-full h-48",
              style: { width: "100%", height: "192px" }
            }}
            onEnd={handleEnd}
          />
        )}
      </div>
      <div className="flex justify-between w-full mt-3">
        <p className="text-sm text-gray-500 italic">Signez dans le cadre ci-dessus</p>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Effacer
        </button>
      </div>
    </div>
  );
}
