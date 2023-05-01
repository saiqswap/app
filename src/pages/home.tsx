import { Button, IconButton } from "@mui/material";
import { ArrowBackIosNewRounded as ArrowBackIcon, ArrowForwardIosRounded as ArrowForwardIcon } from '@mui/icons-material'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { FaDiscord, FaTwitter } from 'react-icons/fa'
// import { RoadmapContent } from "../utils/constants";

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
// import PARTNER_IMG from '../assets/images/partnerMix.png'

import COINFLIP_IMG from '../assets/images/originals/COINFLIP.png'
import DICE_IMG from '../assets/images/originals/DICE.png'
import TOWER_IMG from '../assets/images/originals/TOWER.png'
import LUCKY_WHEEL_IMG from '../assets/images/originals/LUCKY_WHEEL.png'
// import JACKPOT_IMG from '../assets/images/originals/jackpot.png'
// import PLINKO_IMG from '../assets/images/originals/plinko.png'
import { useRef } from "react";

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

const ORIGINALS_PANEL = [
    {title:"COIN FLIP", logo:COINFLIP_IMG, src:"/coinflip"},
    {title:"DICE", logo:DICE_IMG,src:"/dice"},
    {title:"TOWER", logo:TOWER_IMG,src:"/tower"},
    {title:"LUCKY WHEEL", logo: LUCKY_WHEEL_IMG, src:"/wheel"}
]

export default function Home(){
    const originalSliderRef = useRef<Slider>(null)
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
        arrows: true,
        infinite: true,
        speed: 100,
        // centerMode: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        // pauseOnFocus: true,
        responsive:[
            {breakpoint: 1660,settings:{slidesToShow: 3,}},
            {breakpoint: 1250,settings:{slidesToShow: 2,}},
            {breakpoint: 866,settings:{slidesToShow: 1,}},
        ]
    }

    const settingOriginalsSlider = {
        arrows:false,
        infinite: false,
        dots: false,
        slidesToShow: 4,
        slidesToScroll:1,
        draggable: false,
        speed:100,
        responsive:[
            {breakpoint: 1350, settings:{slidesToShow:3}},
            {breakpoint: 1024, settings:{slidesToShow:2}},
            {breakpoint: 658, settings:{slidesToShow:1}},
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
                    {/* <h2>YOU CAN GET REWARDS FROM</h2> */}
                    <h1>SUIHEROES STAKING</h1>
                </div>
                <div className="line-2">
                    <p>Stake $SHS  TOKEN with SUIHEROES NFT to get  SUPERCHARGED APY rewards.</p>
                    <p>The more the NFT's you STAKE the more your APY.</p>
                </div>
                <div className="line-3">
                    <Button variant="contained" color="success" style={{fontFamily: "IndustryBlack"}} onClick={()=>{
                        window.location.href = "/staking"
                    }}>STAKE NOW</Button>
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
        <div className="home-origin">
            <div className="home-origin-header">
                <h3>SUIHEROES ORIGINALS</h3>
                <div className="arrow-buttons">
                    <IconButton size="small" onClick={()=>{originalSliderRef.current?.slickPrev()}}><ArrowBackIcon/></IconButton>
                    <IconButton size="small" onClick={()=>{originalSliderRef.current?.slickNext()}}><ArrowForwardIcon/></IconButton>
                </div>
            </div>
            <Slider ref={originalSliderRef} {...settingOriginalsSlider} className="home-origin-body">
            {
                ORIGINALS_PANEL.map((item,idx)=>{
                    return <div key={idx} className="home-origin-one-wrapper" onClick={()=>{window.location.href=item.src}}>
                        <img src={item.logo} width="90%" height="auto" alt={item.title}/>
                        {/* <div className="one-origin-description">
                            <p>SUIHEROES ORIGINALS</p>
                            <h3>{item.title}</h3>
                        </div> */}
                    </div>
                })
            }
            </Slider>
        </div>
        <div className="home-disclaimer">
            <div className="home-disclaimer-header">Disclaimer</div>
            <div className="home-disclaimer-content">
                <p>This website offers gaming with risk experience. To be a user of our platform you must be 18 y.o</p>
                <p>We are not responsible for any violation of your local laws related to i-gaming.</p>
                <p>To ensure gambling online is legal in your jurisdiction, please consult your local laws and regulations before playing on <span>SUIHEROES</span> platform.</p>
                <p>Play responsibly and have fun</p>
            </div>
        </div>
        {/* <div className="home-roadmap">
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
        </div> */}
        {/* <div className="home-partner">
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
        </div> */}
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