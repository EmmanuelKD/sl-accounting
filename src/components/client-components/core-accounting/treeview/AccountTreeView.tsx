"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { Account } from "@prisma/client";
import {
  IconButton,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
} from "@mui/material";
import { Add, Delete, FolderOpen, Folder } from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";
import { AccountMinimal } from "types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

type AccountWithSubAccounts = Account & {
  subAccounts: AccountWithSubAccounts[];
};

interface TreeViewProps {
  accounts: AccountWithSubAccounts[];
  onAccountDelete: (accountId: string) => void;
  onSubAccountAdd: (parentAccountId: string) => void;
  handleEditAccount: (account: AccountMinimal) => void;
  handleChangeSubAccountParent: (
    accountId: string,
    newParentId: string
  ) => void;
}

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    alignItems: "flex-start",
    "& .MuiTreeItem-iconContainer": {
      marginTop: "4px",
    },
  },
  // @ts-ignore
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

interface DraggableTreeItemProps {
  account: AccountWithSubAccounts;
  selected: string[];
  onAccountDelete: (accountId: string) => void;
  onSubAccountAdd: (parentAccountId: string) => void;
  handleEditAccount: (account: AccountMinimal) => void;
  handleChangeSubAccountParent: (
    accountId: string,
    newParentId: string
  ) => void;
}

const DraggableTreeItem: React.FC<DraggableTreeItemProps> = ({
  account,
  selected,
  onAccountDelete,
  onSubAccountAdd,
  handleEditAccount,
  handleChangeSubAccountParent,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ACCOUNT",
    item: { id: account.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "ACCOUNT",
    drop: (item: { id: string }, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        alert(`${item.id} -> ${account.name}`);
        handleChangeSubAccountParent(item.id, account.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  return (
    // @ts-ignore
    <div ref={drag} key={account.id}>
      {/*  @ts-ignore */}
      <div ref={drop} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <StyledTreeItem
          itemId={account.id}
          sx={{
            margin: 1,
            ...(selected.includes(account.id) && {
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              padding: 2,
              boxShadow: 1,
            }),
            opacity: isDragging ? 0.5 : 1,
            backgroundColor: isOver ? "lightblue" : "inherit",
          }}
          label={
            <Stack direction="column" spacing={1} width="100%">
              <Stack
                direction="row"
                alignItems="flex-start"
                spacing={1}
                sx={{
                  backgroundColor: isOver ? "action.hover" : "transparent",
                  borderRadius: 1,
                  padding: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "center", mt: "4px" }}
                >
                  {Array.isArray(account.subAccounts) &&
                  account.subAccounts.length > 0 ? (
                    <FolderOpen color="primary" fontSize="small" />
                  ) : (
                    <Folder color="action" fontSize="small" />
                  )}
                </Box>
                <Typography variant="body2">{`${account.name} - ${account.number}`}</Typography>
              </Stack>
              {selected.includes(account.id) && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Name</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {account.name}
                      </TableCell>
                      <TableCell align="right">{account.balance}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSubAccountAdd(account.id);
                          }}
                          title="Add Sub Account"
                        >
                          <Add fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccountDelete(account.id);
                          }}
                          title="Delete Account"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </Stack>
          }
        >
          {Array.isArray(account.subAccounts) &&
            account.subAccounts.length > 0 && (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    ml: 2,
                    display: selected.includes(account.id) ? "block" : "none",
                  }}
                >
                  Sub Accounts
                </Typography>
                {account.subAccounts.map((subAccount) => (
                  <DraggableTreeItem
                    key={subAccount.id}
                    account={subAccount}
                    selected={selected}
                    onAccountDelete={onAccountDelete}
                    onSubAccountAdd={onSubAccountAdd}
                    handleEditAccount={handleEditAccount}
                    handleChangeSubAccountParent={handleChangeSubAccountParent}
                  />
                ))}
              </>
            )}
        </StyledTreeItem>
      </div>
    </div>
  );
};

export const AccountTreeView: React.FC<TreeViewProps> = ({
  accounts,
  onAccountDelete,
  onSubAccountAdd,
  handleEditAccount,
  handleChangeSubAccountParent,
}) => {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Container
        sx={{
          minHeight: 400,
          minWidth: 300,
          maxWidth: 600,
          margin: "auto",
          "& .MuiTreeItem-root": {
            "&:hover > .MuiTreeItem-content": {
              backgroundColor: "action.hover",
            },
          },
        }}
      >
        <SimpleTreeView
          multiSelect
          selectedItems={selected}
          onSelectedItemsChange={(items, selectedIds) => {
            setSelected(selectedIds);
          }}
        >
          {accounts.map((account) => (
            <DraggableTreeItem
              key={account.id}
              account={account}
              selected={selected}
              onAccountDelete={onAccountDelete}
              onSubAccountAdd={onSubAccountAdd}
              handleEditAccount={handleEditAccount}
              handleChangeSubAccountParent={handleChangeSubAccountParent}
            />
          ))}
        </SimpleTreeView>
      </Container>
    </DndProvider>
  );
};
