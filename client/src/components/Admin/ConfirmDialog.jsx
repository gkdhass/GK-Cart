/**
 * @file client/src/components/Admin/ConfirmDialog.jsx
 * @description Modal confirmation dialog for destructive actions.
 * Theme: Cream/Peach (#FBE8CE) + Orange (#F96D00)
 */

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

function ConfirmDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const isDanger = variant !== 'warning';

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl border border-[#E8C99A] p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 -mx-6 -mt-6 px-6 py-4 mb-4 bg-[#FBE8CE] border-b border-[#E8C99A] rounded-t-2xl">
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 ${
                      isDanger ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    <HiOutlineExclamationTriangle className="w-6 h-6" />
                  </div>
                  <Dialog.Title className="text-gray-900 font-bold text-lg">
                    {title}
                  </Dialog.Title>
                </div>

                <Dialog.Description className="text-gray-600 text-sm leading-relaxed mb-6">
                  {message}
                </Dialog.Description>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-[#E4DFB5] hover:bg-[#E8C99A] border border-[#E8C99A] transition-all duration-200"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center gap-2 disabled:opacity-50 ${
                      isDanger
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ConfirmDialog;
