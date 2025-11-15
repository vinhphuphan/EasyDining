"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, Loader2, X } from "lucide-react";

interface ImageUploaderProps {
    onUploadSuccess: (url: string) => void;
    disabled?: boolean;
    clearUrl?: boolean;
    existingImage?: string;
}

export function ImageUploader({ onUploadSuccess, disabled, existingImage }: ImageUploaderProps) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = (result: any) => {
        if (typeof result.info === "object" && "secure_url" in result.info) {
            setUrl(result.info.secure_url);
            onUploadSuccess(result.info.secure_url);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (existingImage) {
            setUrl(existingImage);
        } else {
            setUrl(null);
        }
    }, [existingImage]);

    return (
        <CldUploadWidget
            uploadPreset="yxq2lufb"
            onUploadAdded={() => setLoading(true)}
            onSuccess={handleUpload}
            options={{
                singleUploadAutoClose: true,
                multiple: false,
                sources: ["local", "camera", "url"],
            }}
        >
            {({ open }) => (
                <div
                    onClick={!disabled ? () => open() : undefined}
                    className={`relative w-28 h-28 flex flex-col items-center justify-center gap-3 
                    border-2 border-dashed rounded-xl transition 
                    ${url ? "border-gray-300" : "border-muted-foreground/30 hover:border-muted-foreground/60"} 
                    ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer bg-background hover:bg-muted/30"}
                    `}
                >
                    {/* Loading overlay */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl z-10">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Nếu đã có ảnh */}
                    {url ? (
                        <>
                            <img
                                src={url}
                                alt="Uploaded"
                                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUrl(null);
                                    onUploadSuccess("");
                                }}
                                className="absolute top-2 right-2 bg-white/80 text-gray-700 p-1 rounded-md shadow hover:bg-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="h-8 w-8 text-indigo-600" />
                            <p className="text-xs text-gray-700 font-medium">Upload a photo</p>
                        </>
                    )}
                </div>
            )}
        </CldUploadWidget>
    );
}
