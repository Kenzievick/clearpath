// Loading state for /dashboard/upload — a simple centered spinner.
export default function UploadLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div
        className="animate-spin-smooth rounded-full"
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid #E5E7EB",
          borderTopColor: "#1B3A6B",
        }}
      />
    </div>
  );
}
