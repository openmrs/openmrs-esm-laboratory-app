import React from "react";

// Define the props interface for the component
interface MyComponentProps {
  name: string;
}

// Define the functional component using TypeScript
const MyComponent: React.FC<MyComponentProps> = ({ name }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>This is a sample TypeScript React component.</p>
    </div>
  );
};

export default MyComponent;
