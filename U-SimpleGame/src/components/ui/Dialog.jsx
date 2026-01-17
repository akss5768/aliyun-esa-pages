import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ className, children, ...props }) => (
  <DialogPrimitive.Portal {...props}>
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className || ''}`}>
      {children}
    </div>
  </DialogPrimitive.Portal>
);

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity ${className || ''}`}
    {...props}
  />
));

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed z-50 grid w-full gap-4 rounded-b-lg bg-[#F2EDE4] p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 ${className || ''}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));

const DialogHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ''}`}
    {...props}
  />
);

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold text-[#2C241A] ${className || ''}`}
    {...props}
  />
));

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={`text-sm text-[#8B7A99] ${className || ''}`}
    {...props}
  />
));

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};