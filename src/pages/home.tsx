import { Box, Button, Grid } from "@mui/material";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { FaDiscord, FaTwitter } from 'react-icons/fa'

import USER1_IMG from '../assets/images/user/user1.jpeg'
import USER2_IMG from '../assets/images/user/user2.jpeg'
import USER3_IMG from '../assets/images/user/user3.jpeg'
import USER4_IMG from '../assets/images/user/user4.jpeg'
import USER5_IMG from '../assets/images/user/user5.jpeg'
import USER6_IMG from '../assets/images/user/user6.jpeg'
import USER7_IMG from '../assets/images/user/user7.jpeg'
import USER8_IMG from '../assets/images/user/user8.jpeg'
import USER9_IMG from '../assets/images/user/user9.jpeg'
import USER10_IMG from '../assets/images/user/user10.jpeg'
import USER11_IMG from '../assets/images/user/user11.jpeg'
import USER12_IMG from '../assets/images/user/user12.jpeg'
import PARTNER_IMG from '../assets/images/partnerMix.png'
import { RoadmapContent } from "../utils/constants";

const images = [
    USER1_IMG,
    USER2_IMG,
    USER3_IMG,
    USER4_IMG,
    USER5_IMG,
    USER6_IMG,
    USER7_IMG,
    USER8_IMG,
    USER9_IMG,
    USER10_IMG,
    USER11_IMG,
    USER12_IMG,
];

export default function Home(){
    const settings = {
        arrows: false,
        dots: false,
        infinite: true,
        speed: 1000,
        // fade: true,
        pauseOnFocus: true,
        focusOnSelect: true,
        // autoplay: true,
    }

    const settingSlider1 = {
        arrows: false,
        infinite: true,
        speed: 100,
        // centerMode: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: true,
        // pauseOnFocus: true,
        responsive:[
            {
                breakpoint: 1660,
                settings:{
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 1250,
                settings:{
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 866,
                settings:{
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
        ]
    }

    return <div className="home-dashboard">
        <Slider {...settings} className="home-slider">
            <div className="one-slider slider-1">
                <h2>A COLLECTION OF 4000 SUIHEROES</h2>
                <div className="nft-slider-wrapper">
                    <Slider {...settingSlider1} className="nft-slider">
                    {
                        images.map((image, idx)=>{
                            return <div key={idx} className="nft-image"><img key={idx} src={image} alt="NFT"/></div>
                        })
                    }
                    </Slider>
                </div>
            </div>
            <div className="one-slider slider-2">
                <div className="line-1">
                    <h2>YOU CAN GET REWARDS FROM</h2>
                    <h1>SUIHEROES STAKING</h1>
                </div>
                <div className="line-2">
                    <p>You stake SHS token and Suiheroes NFT and then get rewards</p>
                    <p>More SHS and Suiheroes you stake, more rewards you will get</p>
                </div>
                <div className="line-3">
                    <Button variant="contained" color="success" style={{fontFamily: "IndustryBlack"}} onClick={()=>{
                        window.location.href = "/staking"
                    }}>PLAY TO EARN</Button>
                </div>
            </div>
            {/* <div className="one-slider slider-3">
                <div className="line-1">
                    <h1>COINFLIP</h1>
                    <h2>2 TIMES OR LOST ALL</h2>
                </div>
                <div className="line-2">
                    <p>You bet SHS token. If you win, you get 2 times token amount you bet.</p>
                    <p>Whereas, you will lost all tokens</p>
                </div>
                <div className="line-3">
                    <Button variant="contained" color="primary" style={{fontFamily: "IndustryBlack"}} onClick={()=>{
                        window.location.href = "/coinflip"
                    }}>PLAY NOW</Button>
                </div>
            </div>
            <div className="one-slider slider-4">
                <div className="line-1">

                </div>
            </div> */}
        </Slider>
        <div className="home-roadmap">
            <div className="home-roadmap-banner">
                <div className="dot"/><p>Our Roadmap</p><div className="dot"/>
            </div>
            <div className="home-roadmap-header">
                <p>SUIHEROES <span>Project Plan</span></p>
            </div>
            <div className="home-roadmap-content">
                <div className="grid-container">
                {
                    RoadmapContent.map((feature, index)=>{
                        return <div key={index} className="home-roadmap-piece">
                            <div className="home-roadmap-piece-no"><p>{index+1}</p></div>
                            <div className="home-roadmap-piece-content">
                                <p className="home-roadmap-piece-content-main">{feature.main}</p>
                                <p className="home-roadmap-piece-content-details">{feature.details}</p>
                            </div>
                        </div>
                    })
                }
                </div>
            </div>
        </div>
        <div className="home-partner">
            <div className="home-partner-banner">
                <div className="dot"/><p>Our Partner</p><div className="dot"/>
            </div>
            <div className="home-partner-header">
                <p>SUIHEROES PARTNERS</p>
            </div>
            <div className="home-partner-content">
                <div className="home-partner-content-description">
                    <h3 >Disclaimer :</h3>
                    <p>The information shared on this site is not all-encompassing or comprehensive and is not in any way intended to create or implicitly implement any element of a contractual relationship. Instead, the main goal of the site is to provide relevant information to potential users so that they can thoroughly analyze the project and make the right decisions.</p>
                </div>
                <div className="home-partner-content-image-wrapper">
                    <img src={PARTNER_IMG} alt="PARTNERS"/>
                </div>
            </div>
        </div>
        <div className="home-community">
            <div className="home-community-banner">
                🤙
            </div>
            <div className="home-community-header">
                <p>Join Our Community</p>
            </div>
            <div className="home-community-content">
                <button className="btn-community btn-twitter" onClick={()=>{
                    window.location.href="https://twitter.com/Suiheroes_io?t=TR0vVGY4Kbnr-e6dNbNPsA&s=09"
                }}><FaTwitter fontSize="30px"/>&nbsp;Follow our Twitter</button>
                <button className="btn-community btn-discord" onClick={()=>{
                    window.location.href="http://discord.gg/eAGH6JPZVD"
                }}><FaDiscord fontSize="30px"/>&nbsp;Join our Discord</button>
            </div>
        </div>
        <div className="home-footer">
            <p>Copyright © 2023 Suiheroes. All right reserve.</p>
        </div>
    </div>
}