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
  return (
    <Menu
      align="start"
      viewScroll="initial"
      direction="right"
      position="auto"
      arrow
      menuButton={
        <MenuButton>
          <i className="far fa-ellipsis-v"></i>
        </MenuButton>
      }
    >
      <MenuItem>
        <span>Add to asset bucket</span>
      </MenuItem>

      <MenuDivider />
      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>
        <span>Categorize </span>
      </MenuItem>
      <MenuItem>
        <span>Set as primary asset</span>
      </MenuItem>
      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>
        <span>Assign to case</span>
      </MenuItem>

      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>
        <span>Assign user </span>
      </MenuItem>

      <MenuItem>
        <span>Modify Retention</span>
      </MenuItem>

      <MenuItem>
        <span>TBD</span>
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
      <MenuDivider />
      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Open in Getac AI Tools App</span>
      </MenuItem>
      <MenuDivider />
      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>
        <span>Link asset</span>
      </MenuItem>

      <MenuItem disabled>
        <span>Link to this group</span>
      </MenuItem>
      <MenuDivider />

      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>

        <span>Move asset</span>
      </MenuItem>

      <MenuItem disabled>
        <i className="fal fa-expand-arrows-alt"></i>
        <span>Move to this group</span>
      </MenuItem>
      <MenuItem>
        <i className="fal fa-expand-arrows-alt"></i>
        <span>Restrict access</span>
      </MenuItem>
    </Menu>
  );
};
export default ActionMenu;
