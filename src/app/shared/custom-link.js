import { useHistory } from "react-router-dom";

export const CustomLink = ({
  to,
  component: Component,
  onClick,
  ...restProps
}) => {
  const { push } = useHistory();
  return (
    <Component
      onClick={(e) => {
        onClick && onClick(e);
        push(to);
      }}
      {...restProps}
    />
  );
};
