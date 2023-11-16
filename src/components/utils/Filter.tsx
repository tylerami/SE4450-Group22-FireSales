import React from "react";

import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export type FilterDefinition<T> = {
  options: (T | null)[];
  onChange: (value: T | null) => void;
  label: (value: T | null) => string;
  refresh?: () => void;
  value: T | null;
};

type Props<T> = {
  filter: FilterDefinition<T>;
};

const Filter = <T extends {}>({ filter }: Props<T>) => {
  return (
    <Menu>
      <MenuButton
        size={{ base: "xs", xl: "sm", "2xl": "md" }}
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        {filter.label(filter.value)}
      </MenuButton>
      <MenuList>
        {filter.options.map((option, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              filter.onChange(option);
              if (filter.refresh !== undefined) {
                filter.refresh();
              }
            }}
          >
            {filter.label(option)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default Filter;
