import axios from 'axios';
import Link from 'next/link';

export default function EventsDash({
  events,
  setDataHandler,
  loading,
  setLoadingHandler,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = e.target[0].value;
    const desc = e.target[1].value;
    const genre = e.target[2].value;
    const imageFile = e.target[3].files[0];
    const venueName = e.target[4].value;
    const venueAddress = e.target[5].value;
    const date = e.target[6].value;
    const time = e.target[7].value;
    const content = e.target[8].value;

    try {
      setLoadingHandler(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('desc', desc);
      formData.append('genre', genre);
      formData.append('image', imageFile);
      formData.append('venueName', venueName);
      formData.append('venueAddress', venueAddress);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('content', content);
      formData.append('createdBy', userDetails.userName || null);

      const res = await axios.post('/api/events/createEvent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDataHandler(res.data.events);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingHandler(true);
      const res = await axios.delete(`/api/events/deleteEvent/${id}`);
      setDataHandler((data = { ...data, events: res.data.events }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHandler(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex px-10 p-4">
        <h1 className="text-primary my-auto text-xl w-1/4">Add Event</h1>
        {loading && (
          <h1 className="my-auto text-xl w-1/2 flex items-center justify-center text-accent2">
            Please wait...
          </h1>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <form
          className="flex flex-col bg-primary space-y-2 px-10"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Title"
            className="form-input"
            required
          ></input>
          <input
            type="text"
            placeholder="Brief description"
            className="form-input"
            required
          ></input>
          <input
            type="text"
            placeholder="Music Genre"
            className="form-input"
            required
          ></input>

          <input
            type="text"
            placeholder="Venue name"
            className="form-input"
            required
          ></input>
          <input
            type="text"
            placeholder="Venue address"
            className="form-input"
            required
          ></input>

          <div className="flex space-x-2">
            <label for="date" className="w-1/2 text-primary flex">
              <p className="m-auto">Date:</p>
              <input
                type="date"
                name="date"
                id="datePicker"
                className="form-input w-full ms-4"
                required
              ></input>
            </label>
            <label for="time" className="w-1/2 text-primary flex">
              <p className="my-auto ms-1">Time:</p>
              <input
                name="time"
                type="time"
                id="timePicker"
                className="form-input w-full ms-4"
                required
              ></input>
            </label>
          </div>
          <textarea
            placeholder="Content"
            className="form-input"
            cols="30"
            rows="10"
            required
          ></textarea>
          <label className="text-primary flex">
            <p className="m-auto">Image</p>
            <input
              type="file"
              placeholder="Image URL"
              className="w-full ms-4 file-upload-form-input"
              required
            ></input>
          </label>
          <button className="primary-button p-2" inactive={loading}>
            Create Event
          </button>
        </form>
        <div className="grid-cols-1 text-primary space-y-2">
          {events?.map((event) => {
            return (
              <div key={event._id} className="text-primary flex">
                <Link
                  href={`events/${event._id}`}
                  className="w-full flex hover:text-accent hover:border-t-accent hover:border-b-accent border-t border-b pe-2"
                >
                  <h2 className="text-xl">{event.title}</h2>
                  <h2 className="ms-auto text-xl">{event.date}</h2>
                </Link>

                <button
                  className="border border-accent px-1 bg-accent bg-opacity-20 hover:bg-opacity-30 text-accent rounded-tr rounded-br text-xs"
                  onClick={() => handleDelete(event._id)}
                  inactive={loading}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
