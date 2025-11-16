import { MdBlock } from "react-icons/md";

export default function OfflineOverlay() {
  return (
    <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black bg-opacity-100">
      <div className="text-center px-6">
        <MdBlock className="mx-auto text-red-500 text-6xl mb-4" />
        <h1 className="text-white text-3xl font-bold mb-2">Website Offline</h1>
        <p className="text-gray-300 text-lg">
          This website has been taken offline indefinitely.
        </p>
      </div>
    </div>
  );
}
