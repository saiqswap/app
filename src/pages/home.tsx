import { Box, Zoom } from "@mui/material";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import ProjectAssetsImg from '../assets/images/image-p-1600.png'

export default function Home(){

    const setting = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    return <div className="dashboard">
        <h3>SUIHEROES</h3>
        <h1>A COLLECTION OF 4000 SUIHEROES</h1>
        <div className="project-about">
            <div className="project-assets">
                <img src={ProjectAssetsImg} alt="Project Assets"/>
            </div>
            <div>

            </div>
        </div>
    </div>
}