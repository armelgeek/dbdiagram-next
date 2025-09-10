"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, EditIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/shared/lib/utils';

type Props = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  disabled?: boolean | null;
  label?: string;
  placeholder?: string;
  value?: string | null;
  type?: "text" | "richtext";
};

export function EditableLabelForm({ className, placeholder, value, label, type = "text", disabled, ...form }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const setEditOn = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const setEditOff = () => {
    if (disabled) return;
    setIsEditing(false);
  };

  return (
    <form
      {...form}
      className={cn(
        "border-b gap-1 transition-colors border-b-input pb-1",
        isEditing
          ? "border-b-primary"
          : disabled
            ? ""
            : "hover:border-b-primary",
        className
      )}
      onSubmit={setEditOff}
    >
      <Label
        htmlFor="__value"
        className="text-muted-foreground text-xs leading-none"
      >
        {label ?? "Value"}
      </Label>

      <div
        className={cn(
          "flex flex-row justify-between items-center text-ellipsis overflow-clip",
          type === "richtext" ? (value ? "h-auto" : "h-16") : "h-8"
        )}
        onClick={setEditOn}
      >
        {isEditing ? (
          type === "richtext" ? (
            <Textarea
              key="__richtext"
              id="__value"
              name="value"
              autoFocus
              rows={5}
              onBlur={() => setIsEditing(false)}
              placeholder={placeholder ?? "---"}
              defaultValue={value ?? ""}
              readOnly={!isEditing}
              className="h-full border-none shadow-none focus-visible:outline-hidden focus-visible:ring-0 rounded-none"
            ></Textarea>
          ) : (
            <Input
              key="__text"
              id="__value"
              name="value"
              autoFocus
              onBlur={() => setIsEditing(false)}
              placeholder={placeholder ?? "---"}
              defaultValue={value ?? ""}
              readOnly={!isEditing}
              className="h-full border-none shadow-none resize-none focus-visible:outline-hidden focus-visible:ring-0 rounded-none"
            />
          )
        ) : (
          <h4
            className={cn(
              "overflow-clip",
              !value && placeholder ? "text-muted-foreground text-xs" : ""
            )}
          >
            {value ?? placeholder ?? "---"}
          </h4>
        )}

        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              type="submit"
              disabled={!isEditing || (disabled ?? false)}
            >
              <CheckIcon />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              type="reset"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              disabled={!isEditing || (disabled ?? false)}
            >
              <XIcon />
            </Button>
          </div>
        ) : disabled ? null : (
          <EditIcon className="size-3.5" />
        )}
      </div>
    </form>
  );
}
