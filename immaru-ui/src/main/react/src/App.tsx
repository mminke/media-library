import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import {useHotkeys} from "react-hotkeys-hook"

import MainAppBar from './components/MainAppBar'
import MainDrawer from './components/MainDrawer'
import ImageList from './components/ImageList'
import ImageDetails from './components/ImageDetails'
import ImageViewer from './components/ImageViewer'
import FileUpload from './components/FileUpload'
import CollectionSelector from './components/CollectionSelector'
import { Collection } from './repositories/CollectionRepository'
import AssetRepository, {Asset} from './repositories/AssetRepository'

import {hotkeysEnabledFilter} from './HotkeyState'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  workspace: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    overflowY: 'auto',
  },
  contentPadded: {
    display: 'flex',
    padding: theme.spacing(2),
    overflowX: 'hidden',
    flexGrow: 1,
  }
}));

export default function App() {
    const prefersDarkMode = true;
    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                type: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    const classes = useStyles()

    const [mainDrawerOpen, setMainDrawerOpen] = useState(false);
    const toggleMainDrawer = () => {
        setMainDrawerOpen(!mainDrawerOpen);
    };

    const [activeCollection, setActiveCollection] = useState<Collection>()
    const handleCollectionSelected = (collection: Collection) => {
        setActiveCollection(collection)
    }

    const [imageDetailsOpen, setImageDetailsOpen] = useState(false);

    const closeImageDetails = () => {
        setImageDetailsOpen(false)
    }

    const toggleImageDetails = () => {
        setImageDetailsOpen(!imageDetailsOpen)
    }

    const [selectedAsset, setSelectedAsset] = useState<Asset|null>(null);
    const handleImageSelected = (asset: Asset) => {
        setSelectedAsset(asset)
    }

    useHotkeys('i', hotkeysEnabledFilter(toggleImageDetails), [imageDetailsOpen]);

    if(activeCollection === undefined) {
        return (
            <CollectionSelector onSelected={handleCollectionSelected}/>
        )
    } else {
        return (
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <CssBaseline/>
                    <Router>
                        <MainAppBar activeCollection={activeCollection} toggleMainDrawer={toggleMainDrawer}/>
                        <div className={classes.workspace}>
                            <MainDrawer open={mainDrawerOpen}/>
                            <ImageDetails activeCollection={activeCollection} asset={selectedAsset} open={imageDetailsOpen} onClose={closeImageDetails}/>

                            <main className={classes.content}>
                                <div className={classes.contentPadded}>
                                    <Switch>
                                        <Route path="/upload">
                                            <FileUpload activeCollection={activeCollection}/>
                                        </Route>
                                        <Route path="/asset/:id" children={<ImageViewer collection={activeCollection}/>}/>
                                        <Route path={["/", "/media"]}>
                                            <ImageList
                                                activeCollection={activeCollection}
                                                onImageSelected={handleImageSelected}
                                            />
                                        </Route>
                                    </Switch>
                                </div>
                            </main>
                        </div>
                    </Router>
                </div>
            </ThemeProvider>
        );
  }
}