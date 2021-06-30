import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";

type Props = {
  isSelected: boolean;
};
const ActionMenu: React.FC<Props> = ({ isSelected }) => {
  console.log(isSelected);
  return (
    <Menu
      align="start"
      viewScroll="initial"
      direction="right"
      position="auto"
      arrow
      menuButton={
        <MenuButton>
          <MoreVertIcon />
        </MenuButton>
      }
    >
      {!isSelected && (
        <MenuItem onClick={() => alert()}>
          <i className="fal fa-expand-arrows-alt"></i>

          <span>Categories </span>
        </MenuItem>
      )}
      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Tag case </span>
      </MenuItem>
      <MenuItem>
        <span>Assign user </span>
      </MenuItem>
      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Email </span>
      </MenuItem>
      <SubMenu label="Export">
        <MenuItem>
          <span>File </span>
        </MenuItem>
        <MenuItem>
          <span>Metadata </span>
        </MenuItem>
        <MenuItem>
          <span>Evidence overlaid video </span>
        </MenuItem>
        <MenuItem>
          <span>Metadata overlaid video</span>
        </MenuItem>
      </SubMenu>

      <SubMenu label="Retentions">
        <MenuItem>items</MenuItem>
      </SubMenu>
      <MenuDivider />

      <MenuItem disabled>
        <span>Add to asset bucket</span>
      </MenuItem>
      <MenuDivider />

      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Open in Getac AI tools App</span>
      </MenuItem>

      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Copy</span>
      </MenuItem>

      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Paste</span>
      </MenuItem>

      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Cut</span>
      </MenuItem>
      <MenuDivider />

      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Lock</span>
      </MenuItem>
    </Menu>
  );
};
export default ActionMenu;
