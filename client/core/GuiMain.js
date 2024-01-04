import React from "react";
import Menu from './../core/menujr';
import Carousel from "./../core/carousel";
import OpcImgMain from './../core/OpcImgMain';

export default function GuiMain() {
    return (
        <div>
            <header>
                <Menu />
                <Carousel />
                <OpcImgMain />
            </header>
        </div>
    )
}
