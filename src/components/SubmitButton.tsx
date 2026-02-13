import "./SubmitButton.css";

interface Button {
  name: string;
  submitFunction: () => void;
}

export function SubmitButton({ name, submitFunction }: Button) {
  return (
    <>
      <button className="submit-button" onClick={submitFunction}>
        {name}
      </button>
    </>
  );
}
