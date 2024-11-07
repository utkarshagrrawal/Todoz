export default function TestimonialCard({ text, name, role }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"{text}"</p>
      <div className="text-gray-800 font-semibold">{name}</div>
      <div className="text-gray-500 text-sm">{role}</div>
    </div>
  );
}
