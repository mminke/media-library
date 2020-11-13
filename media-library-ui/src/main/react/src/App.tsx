import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';

import {BrowserRouter as Router, Switch, Route} from "react-router-dom"

import MainAppBar from './components/MainAppBar'
import MainDrawer from './components/MainDrawer'
import ImageList from './components/ImageList'
import ImageDetails from './components/ImageDetails'
import FileUpload from './components/FileUpload'
import CollectionSelector from './components/CollectionSelector'
import { Collection } from './repositories/CollectionRepository'

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
    padding: theme.spacing(2),
    overflowX: 'hidden',
    flexGrow: 1,
  }
}));

export default function App() {
    const classes = useStyles();
    const [mainDrawerOpen, setMainDrawerOpen] = useState(false);
    const toggleMainDrawer = () => {
        setMainDrawerOpen(!mainDrawerOpen);
    };

    const [activeCollection, setActiveCollection] = useState<Collection>()
    const handleCollectionSelected = (collection: Collection) => {
        setActiveCollection(collection)
    }

    const [imageDetailsOpen, setImageDetailsOpen] = useState(false);
    const openImageDetails = () => {
        setImageDetailsOpen(true);
    }
    const closeImageDetails = () => {
        setImageDetailsOpen(false);
    }

    const [selectedAsset, setSelectedAsset] = useState(null);
    const handleImageSelected = (asset: any) => {
        setSelectedAsset(asset);
        openImageDetails();
    }

    if(activeCollection === undefined) {
        return (
            <CollectionSelector onSelected={handleCollectionSelected}/>
        )
    } else {
        return (
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
                                   <Route path={["/", "/media"]}>
                                        <ImageList activeCollection={activeCollection} onImageSelected={handleImageSelected}/>
                                    </Route>
                                </Switch>
                            </div>
                        </main>
                    </div>
                </Router>
            </div>
        );
  }
}
