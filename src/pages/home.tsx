import { Box, Zoom } from "@mui/material";

import SwiperCore, {Navigation, Autoplay, Pagination, EffectCoverflow} from "swiper"
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/swiper.min.css";
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


SwiperCore.use([Navigation, Autoplay, Pagination, EffectCoverflow])

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

    return <div className="home-dashboard">
        {/* <h3>SUIHEROES</h3>
        <h1>A COLLECTION OF 4000 SUIHEROES</h1>
        <div className="hero-panel">
        <div style={{backgroundAttachment:"fixed", backgroundPosition:"fixed", backgroundSize:"cover", backgroundColor:"blue"}}>
            <div id="mint" style={{zIndex: "300", maxWidth:"auto"}}>
                <Box display={['block','block','block']}>
                    <Swiper spaceBetween={20} slidesPerView={2} effect="coverflow" grabCursor={true} centeredSlides={true} modules={[]} speed={1500} coverflowEffect={{rotate:0, stretch:0, depth: 200, modifier: 5, slideShadows: true}} autoplay={{delay: 1500, disableOnInteraction: false}} navigation={true} pagination={{clickable: true}} style={{maxWidth: "1000px"}}>
                    {
                        images.map((image,i)=>{
                            return <SwiperSlide key={i} style={{zIndex:"300"}}>
                                <img src={image} alt="Hero" style={{borderRadius:"10px", objectFit: "cover", zIndex:"300",width:"300px", height:"300px"}}/>
                            </SwiperSlide>
                        })
                    }
                    </Swiper>
                </Box>
            </div>
        </div>
        </div> */}
        
    </div>
}