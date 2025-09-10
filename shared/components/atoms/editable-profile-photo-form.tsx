"use client";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Upload, Trash } from "lucide-react";
import { useState } from "react";
import { cn } from '@/shared/lib/utils';
import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { authClient } from '@/auth-client';

type Props = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  disabled?: boolean | null;
  label?: string;
  photoUrl?: string | null;
};

export function EditableProfilePhotoForm({
  className,
  photoUrl: initialPhotoUrl,
  disabled,
  ...form
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);

  const updateAvatar = async (url: string) => {
    try {
      setIsLoading(true);
      setPhotoUrl(url);
      await authClient.updateUser({
        image: url
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form {...form} className={cn("flex flex-col items-center gap-4", className)}>
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Photo Container */}
        <div className={cn(
          "w-24 h-24 rounded-full overflow-hidden border-2 border-input",
          !disabled && "hover:border-primary",
          isLoading && "opacity-50"
        )}>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Remove Icon Overlay */}
          {!disabled && isHovered && photoUrl && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white"
              onClick={async (e) => {
                e.preventDefault();
                await updateAvatar('');
              }}
            >
              <Trash className="w-4 h-4" />
              <span className="sr-only">Remove photo</span>
            </Button>
          )}
        </div>
      </div>

      {/* Upload Button */}
      {!disabled && !isLoading && (
        <div className="flex gap-2">
          <UploadButton<OurFileRouter, 'imageUploader'>
            endpoint={'imageUploader'}
            onUploadBegin={() => {
              setIsLoading(true);
            }}
            onClientUploadComplete={async (res: { url: string }[]) => {
              if (res?.[0]) {
                await updateAvatar(res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              console.error(error);
              setIsLoading(false);
            }}
            className="ut-button:bg-primary ut-button:hover:bg-primary/90 ut-button:text-primary-foreground ut-button:rounded-md ut-button:px-4 ut-button:py-2 ut-button:text-sm ut-button:font-medium ut-button:flex ut-button:items-center ut-button:gap-2 ut-button:h-9"
          >
            {/* Custom Upload Button Content */}
            {({ isUploading }) => (
              <>
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Upload photo"}
              </>
            )}
          </UploadButton>
        </div>
      )}
    </form>
  );
}