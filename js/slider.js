const slider = () => {
    const prevBtn    = document.querySelector('#prev'),
          nextBtn    = document.querySelector('#next'),
          inner      = document.querySelector('#slider .slider_inner'),
          dotsInner  = document.querySelector('#slider .slider_dots-inner'),
          slides     = Array.from(document.querySelectorAll('#slider .slide')),
          dots       = Array.from(document.querySelectorAll('#slider .slider_dots-item')),
          slidesUIDs = [];

    let currentUID = null, nextUID  = null, prevUID  = null,
        slideSize  = null,
        _currentIndex = 0;

    const uid = () => 'uid-' + new Date().getTime() + '-' + Math.random().toString(16).slice(2)

    const showSlide = (slide) => {
        if (!slide) return
        slide.classList.remove('no-transition')
        slide.style.opacity = '1'
    }

    const hideSlide = (slide) => {
        if (!slide) return
        slide.classList.add('no-transition')
        slide.style.opacity = '0'
    }

    const getCurrentSlides = () => {
        const current = inner.querySelector(`[data-uid=${currentUID}]`),
              next    = inner.querySelector(`[data-uid=${nextUID}]`),
              prev    = inner.querySelector(`[data-uid=${prevUID}]`),
              currentIndex = slidesUIDs.findIndex((uid) => uid == currentUID),
              nextIndex    = slidesUIDs.findIndex((uid) => uid == nextUID),
              prevIndex    = slidesUIDs.findIndex((uid) => uid == prevUID);

        return { current, next, prev, currentIndex, nextIndex, prevIndex }
    }

    const getSlide = (uid) => inner.querySelector(`[data-uid=${uid}]`)

    const initSlides = () => {
        _currentIndex = 0
        const first  = slides.at(0)
        const second = slides.at(1)
        const last   = slides.at(-1)

        first.style.left  = '0px'
        second.style.left = `${slideSize.width}px`
        last.style.left   = `${slideSize.width * -1}px`

        showSlide(first)

        currentUID = first.getAttribute('data-uid')
        nextUID    = second.getAttribute('data-uid')
        prevUID    = last.getAttribute('data-uid')

        setDotActive(currentUID)
    }
	
    const onDotClick = (dot) => {
        if (!dot) return

        const index = parseInt(dot.getAttribute('data-dot-index'))
        const uid   = parseInt(dot.getAttribute('data-dot-uid'))

        if (index == _currentIndex) return

        if (index > _currentIndex) nextUID = slidesUIDs.at(index)
        else prevUID = slidesUIDs.at(index)

        const nextSlide    = getSlide(nextUID)
        const prevSlide    = getSlide(prevUID)
        const currentSlide = getSlide(currentUID)

        if (index > _currentIndex) { 

            nextSlide.style.left = `${slideSize.width}px`

            setTimeout(() => {
                showSlide(nextSlide)
                currentSlide.style.left = `${slideSize.width * -1}px`
                nextSlide.style.left    = `${0}px`
            })

            afterSlide({ currentIndex: index - 1, prevIndex: index - 2, nextIndex: index }, 1)
        } else {

            prevSlide.style.left = `${slideSize.width * -1}px`

            setTimeout(() => {
                showSlide(prevSlide)
                currentSlide.style.left = `${slideSize.width}px`
                prevSlide.style.left    = `${0}px`
            })

            afterSlide({ currentIndex: index + 1, prevIndex: index, nextIndex: index + 2 }, -1)
        }
    }

    const initDots = () => dots.map(dot => dot.addEventListener('click', (e) => onDotClick(dot)))

    const init = () => {
        slides.map((slide, i) => {
            const slideUID = uid()
            const dot = dots.at(i)

            slide.setAttribute('data-uid', slideUID)
            slide.setAttribute('data-index', i)

            dot.setAttribute('data-dot-uid', slideUID)
            dot.setAttribute('data-dot-index', i)

            hideSlide(slide)
            slidesUIDs.push(slideUID)
            if (!slideSize) slideSize = slide.getBoundingClientRect()
        })

        initSlides()
        initDots()
    }

    const setDotActive = (uid) => {
        const currentDot = dotsInner.querySelector(`[data-dot-uid=${uid}]`)
        if (!currentDot) return

        dots.map((dot) => dot.classList.remove('active'))
        currentDot.classList.add('active')
    }

    const afterSlide = ({ currentIndex, prevIndex, nextIndex }, direction) => setTimeout(() => {
        _currentIndex = currentIndex + direction
        prevUID    = slidesUIDs.at(prevIndex    + direction) || slidesUIDs.at(0)
        currentUID = slidesUIDs.at(currentIndex + direction) || slidesUIDs.at(0)
        nextUID    = slidesUIDs.at(nextIndex    + direction) || slidesUIDs.at(0)

        hideSlide(getSlide(prevUID))
        hideSlide(getSlide(nextUID))
        setDotActive(currentUID)
    }, 500)
    
    const next = () => {
        let { current, next, prev, currentIndex, nextIndex, prevIndex } = getCurrentSlides()

        next.style.left = `${slideSize.width}px`

        setTimeout(() => {
            showSlide(next)
            current.style.left = `${slideSize.width * -1}px`
            next.style.left    = `${0}px`
        })

        afterSlide({ currentIndex, prevIndex, nextIndex }, 1)
    }

    const prev = () => {
        let { current, next, prev, currentIndex, nextIndex, prevIndex } = getCurrentSlides()

        prev.style.left = `${slideSize.width * -1}px`

        setTimeout(() => {
            showSlide(prev)
            current.style.left = `${slideSize.width}px`
            prev.style.left    = `${0}px`
        })
        
        afterSlide({ currentIndex, prevIndex, nextIndex }, -1)
    }

    prevBtn.addEventListener('click', () => prev())
    nextBtn.addEventListener('click', () => next())
    init()
}

document.addEventListener('DOMContentLoaded', () => slider())