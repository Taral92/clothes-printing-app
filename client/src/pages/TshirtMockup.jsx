import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TshirtMockup = () => {
  const navigate = useNavigate();
  const stageRef = useRef();
  const logoRef = useRef();
  const transformerRef = useRef();

  const [logoURL, setLogoURL] = useState(null);
  const [tshirtImage] = useImage("/assets/x.avif", "anonymous");
  const [logoImage, logoStatus] = useImage(logoURL);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (
      logoStatus === "loaded" &&
      logoImage &&
      logoRef.current &&
      transformerRef.current
    ) {
      transformerRef.current.nodes([logoRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [logoImage, logoStatus]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoURL(url);
  };

  const exportMockup = async () => {
    transformerRef.current.visible(false);
    transformerRef.current.getLayer().batchDraw();

    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });

    transformerRef.current.visible(true);
    transformerRef.current.getLayer().batchDraw();

    const blob = await (await fetch(uri)).blob();

    try {
      const res = await axios.post("http://localhost:3000/api/upload", blob, {
        headers: {
          "Content-Type": "image/png",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("✅ Uploaded!");
      console.log("Uploaded URL:", res.data.url);
    } catch (err) {
      toast.error("Upload failed.");
      console.error("❌ Upload error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 text-center">
          👕 Upload Your Logo
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />

          {logoURL && (
            <button
              onClick={exportMockup}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              📤 Upload Mockup
            </button>
          )}
        </div>

        <div className="overflow-auto border rounded-lg shadow-inner bg-gray-100 p-2">
          <Stage
            width={window.innerWidth < 640 ? 300 : 500}
            height={window.innerWidth < 640 ? 400 : 600}
            ref={stageRef}
          >
            <Layer>
              {tshirtImage && (
                <KonvaImage
                  image={tshirtImage}
                  width={window.innerWidth < 640 ? 300 : 500}
                  height={window.innerWidth < 640 ? 400 : 600}
                />
              )}
            </Layer>
            <Layer>
              {logoImage && (
                <>
                  <KonvaImage
                    image={logoImage}
                    ref={logoRef}
                    x={150}
                    y={200}
                    width={200}
                    height={200}
                    draggable
                    onDragEnd={() => transformerRef.current.getLayer().batchDraw()}
                    onTransformEnd={() => {
                      const node = logoRef.current;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      node.width(node.width() * scaleX);
                      node.height(node.height() * scaleY);
                      transformerRef.current.getLayer().batchDraw();
                    }}
                  />
                  <Transformer
                    ref={transformerRef}
                    enabledAnchors={[
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                    ]}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 40 || newBox.height < 40)
                        return oldBox;
                      return newBox;
                    }}
                    rotateEnabled
                  />
                </>
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default TshirtMockup;