import React, { useState } from "react";
import { X, Camera } from "lucide-react";

const CheckInModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ note });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <p className="text-label-caps font-semibold text-secondary">
            PODS COMMITMENT
          </p>
          <div className="flex flex-1 justify-end">
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-headline-md font-semibold text-primary">
            Daily Check-in
          </h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Log your progress to maintain your streak.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-label-caps text-on-surface-variant">
              OPTIONAL NOTE
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you achieve today?"
              rows={3}
              className="w-full resize-none rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-label-caps text-on-surface-variant">
              PROOF OF WORK
            </label>
            <div className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg bg-surface-container-low py-8 text-on-surface-variant opacity-60">
              <Camera size={24} className="mb-2" />
              <span className="text-body-sm">Upload photo</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-[#8B5A2B] px-4 py-3 text-body-md font-semibold text-white transition-colors hover:bg-[#734A23] disabled:opacity-60"
            >
              {isSubmitting ? "Checking in..." : "Complete Check-in"}
            </button>
            <p className="mt-4 text-center text-label-caps text-on-surface-variant text-[10px]">
              Checked in by 11:59 PM to keep your streak alive.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;
