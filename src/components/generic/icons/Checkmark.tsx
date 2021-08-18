const Checkmark = ({ stroke }: { stroke?: string }) => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 14 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 3.66667L5.58824 8L13 1"
      stroke={stroke || "#00CF9D"}
      strokeWidth="2"
    />
  </svg>
)

export default Checkmark
