const TikTok = (props)=>{
    return  <>
    <blockquote className="tiktok-embed" cite={'https://www.tiktok.com/@usere03yjbeu2r/video/'+props.link} data-video-id={props.link} 
    style={props.style} > 
        <section>  
        </section> 
        <iframe src={'https://www.tiktok.com/embed/v2/'+props.link+'?lang=ko-KR'}    scrolling="no"
            style={{width: '100%', height: 550, display: 'block', visibility: 'unset',border:0,borderTopLeftRadius:10,borderTopRightRadius:10}}
        />
    </blockquote> 

    </>
}

export default TikTok
