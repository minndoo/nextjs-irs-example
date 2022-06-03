import { useRouter } from "next/router";
import type { FC, MouseEvent, ReactNode } from "react";
import { Container, Menu, MenuItemProps } from "semantic-ui-react";

const items = [
  { key: "homeMenuItem", value: "Home", matchingPath: "/" },
  { key: "authorsMenuItem", value: "Authors", matchingPath: "/authors" },
  { key: "galleriesMenuItem", value: "Galleries", matchingPath: "/galleries" },
  { key: "photosMenuItem", value: "Photos", matchingPath: "/photos" },
];

type Props = {
  children: NonNullable<ReactNode>;
};

export const Layout: FC<Props> = ({ children }) => {
  const { route, push } = useRouter();

  const onMenuItemClick = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    { href }: MenuItemProps
  ) => {
    e.preventDefault();
    push(href);
  };

  return (
    <>
      <Menu pointing secondary>
        {items.map(({ value, matchingPath, key }) => (
          <Menu.Item
            as="a"
            key={key}
            active={route === matchingPath}
            name={value}
            onClick={onMenuItemClick}
            href={matchingPath}
          />
        ))}
      </Menu>
      <Container>{children}</Container>
    </>
  );
};
