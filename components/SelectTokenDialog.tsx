import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useState } from 'react';
import { AssetData } from '@components';
import { Dialog, DialogProps, Divider, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import { addressInputRegexp, addressRegexp } from 'utils';

export const SelectTokenDialog = (
  { open, close, assets, tokenSetter }: DialogProps & { close: () => void, assets: AssetData[], tokenSetter: Dispatch<SetStateAction<string>> }
) => {
  const defaultInputValue = '0x';

  const [value, setValue] = useState(defaultInputValue);

  useEffect(() => {
    setValue(defaultInputValue);
  }, [open]);

  const handleInput = (e: any) => {
    const newValue = e.target.value as string;
    if (newValue.match(addressInputRegexp)) {
      tokenSetter(newValue);
      setValue(newValue);
      return;
    }
    if (newValue === '') {
      tokenSetter(defaultInputValue);
      setValue(defaultInputValue);
      return;
    }
    const diff = newValue.substring(value.length);
    if (diff.match(addressRegexp)) {
      tokenSetter(diff);
      setValue(diff);
      return;
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      close();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      style={{ zIndex: 300 }}
      PaperProps={{
        style: { padding: '20px 0px 0px', width: '515px', height: '600px', overflow: 'auto' },
      }}
    >
      <TextField
        fullWidth
        placeholder='0x0000...0000'
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        InputProps={{
          autoComplete: 'off',
        }}
      />
      <Divider style={{ paddingTop: '10px' }} />
      <List>
        {assets.map(a => <ListItem key={a.address} disablePadding>
          <ListItemButton onClick={() => { tokenSetter(a.address); close(); }}>
            <ListItemText primary={a.shortName} />
          </ListItemButton>
        </ListItem>)}
      </List>
    </Dialog>
  );
};
