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

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth < 640 ? 320 : 500,
    height: window.innerWidth < 640 ? 420 : 600,
  });

  const [logoURL, setLogoURL] = useState(null);
  const [uploadedURL, setUploadedURL] = useState(null);
  const [tshirtImage] = useImage("/assets/x.avif", "anonymous");
  const [logoImage] = useImage(logoURL);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (logoImage && logoRef.current && transformerRef.current) {
      transformerRef.current.nodes([logoRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [logoImage]);

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
      setUploadedURL(res.data.url);
      toast.success("✅ Uploaded!");
    } catch (err) {
      toast.error("Upload failed.");
      console.error("❌ Upload error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-100 px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
          👕 Design Your T-Shirt
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex justify-center items-center border rounded-xl shadow-inner bg-gray-100 p-4">
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              ref={stageRef}
            >
              <Layer>
                {tshirtImage && (
                  <KonvaImage
                    image={tshirtImage}
                    width={stageSize.width}
                    height={stageSize.height}
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
                      width={150}
                      height={150}
                      draggable
                      onClick={() => {
                        transformerRef.current.nodes([logoRef.current]);
                        transformerRef.current.getLayer().batchDraw();
                      }}
                      onTransformEnd={() => {
                        const node = logoRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        node.scaleX(1);
                        node.scaleY(1);
                        node.width(Math.max(40, node.width() * scaleX));
                        node.height(Math.max(40, node.height() * scaleY));
                        transformerRef.current.nodes([node]);
                        transformerRef.current.getLayer().batchDraw();
                      }}
                    />
                    <Transformer
                      ref={transformerRef}
                      rotateEnabled
                      enabledAnchors={[
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                      ]}
                      boundBoxFunc={(oldBox, newBox) => {
                        return newBox.width < 40 || newBox.height < 40
                          ? oldBox
                          : newBox;
                      }}
                    />
                  </>
                )}
              </Layer>
            </Stage>
          </div>

          <div className="flex flex-col justify-start space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload your Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="block w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {logoURL && (
              <button
                onClick={exportMockup}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
              >
                📤 Upload Mockup
              </button>
            )}

            {uploadedURL && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  ✅ Uploaded Mockup URL:
                </p>
                <a
                  href={uploadedURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline break-all"
                >
                  {uploadedURL}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TshirtMockup;
