// components/ui/alert.js

export const Alert = ({ children }) => (
    <div className="bg-red-500 text-white p-4 rounded-md shadow-lg">
      {children}
    </div>
  );

  export const AlertDescription = ({ children }) => (
    <p className="text-white">
      {children}
    </p>
  );
