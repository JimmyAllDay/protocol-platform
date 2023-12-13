import { useState, useEffect } from 'react';

export default function TicketsDash({
  tickets,
  setDataHandler,
  loading,
  setLoadingHandler,
}) {
  return (
    <div className="text-primary">
      <div className="flex flex-col">
        <div className="flex px-10 p-4">
          <h1 className="text-primary my-auto text-xl w-1/4">
            Add Event Ticket
          </h1>
          {loading && (
            <h1 className="my-auto text-xl w-1/2 flex items-center justify-center text-accent2">
              Please wait...
            </h1>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <form className="flex flex-col space-y-2 px-10">
            <input
              type="text"
              placeholder="Product name"
              className="form-input"
            ></input>
            <input
              type="text"
              placeholder="Slug"
              className="form-input"
            ></input>
            <select className="form-input">
              <option></option>
              <option>T-Shirt</option>
              <option>Hat</option>
              <option>Merchandise</option>
            </select>

            <input
              type="text"
              placeholder="Price"
              className="form-input"
            ></input>
            <input
              type="text"
              placeholder="Brand"
              className="form-input"
            ></input>
            <textarea
              type="text"
              rows="10"
              cols="30"
              placeholder="Description"
              className="form-input"
            ></textarea>
            <label className="flex w-full">
              <p className="my-auto">Image</p>
              <input
                type="file"
                className="file-upload-form-input w-full ms-4"
              ></input>
            </label>
            <button className="primary-button p-2" inactive={loading}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
