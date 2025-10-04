export default function EmptyState({ message , icon }) {
  // messsage : pass through as props to be displayed as text
  // icon : pass through icon details and styles as a props 
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="relative max-w-sm w-full">
        <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-800 rounded-xl"></span>
        <div className="relative h-full p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
          {icon && (
            <div className="flex items-center justify-center w-14 h-14 mb-3 bg-gray-800 rounded-lg">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-100">
            {message}
          </h3>
        </div>
      </div>
    </div>
  );
}
