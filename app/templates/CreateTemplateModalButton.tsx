'use client';

import { useRef } from 'react';
import { createTemplate } from './actions';
import { TEMPLATE_CHANNELS } from './constants';

export function CreateTemplateModalButton() {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        Create New Template
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Template</h3>
          <form action={createTemplate} className="flex flex-col gap-4 mt-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Template Name</span>
              </div>
              <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" required />
            </label>

            <label className="form-control w-full">
              <div className="label mr-2">
                <span className="label-text">Channel</span>
              </div>
              <select name="channel" className="select select-bordered" required defaultValue="instagram">
                {TEMPLATE_CHANNELS.map((channel) => (
                  <option key={`option-${channel}`} value={channel}>
                    {channel[0].toUpperCase() + channel.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create
              </button>
              <button type="button" className="btn" onClick={() => modalRef.current?.close()}>
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
