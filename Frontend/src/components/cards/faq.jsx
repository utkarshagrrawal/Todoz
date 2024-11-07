export default function FaqItem({ question, answer }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h4 className="text-lg font-semibold text-gray-800">{question}</h4>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
