export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Po ngarkohet">
      <div className="skel" style={{ height: 180, marginTop: 24 }} />
      <div className="trip-list" style={{ marginTop: 16 }}>
        <div className="skel" />
        <div className="skel" />
      </div>
    </main>
  );
}
