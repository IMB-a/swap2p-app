import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AssetData } from '@components';
import { Dialog, DialogProps, Divider, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';

export const SelectTokenDialog = (
  { open, onClose, assets, tokenSetter }: DialogProps & { assets: AssetData[], tokenSetter: Dispatch<SetStateAction<string>> }
) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
  }, [open]);

  return (
    <Dialog
      open={open}
      style={{ zIndex: 300 }}
      onClose={onClose}
      PaperProps={{
        style: { padding: '20px 0px 0px', width: '515px', height: '600px', overflow: 'auto' },
      }}
    >
      <TextField
        fullWidth
        placeholder='0x0000...0000'
        value={value}
        onChange={e => { tokenSetter(e.target.value); setValue(e.target.value) }}
        InputProps={{
          autoComplete: 'off',
        }}
      />
      <Divider style={{ paddingTop: '10px' }} />
      <List>
        {assets.map(a => <ListItem key={a.address} disablePadding>
          <ListItemButton onClick={() => { tokenSetter(a.address); onClose?.({}, 'escapeKeyDown'); }}>
            <ListItemText primary={a.shortName} />
          </ListItemButton>
        </ListItem>)}
      </List>
    </Dialog>
  );
};
