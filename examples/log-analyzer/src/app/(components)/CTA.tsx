import {
    ContainerAnimated,
    ContainerStagger,
    GalleryGrid,
    GalleryGridCell,
} from "@/components/blocks/cta-section-with-gallery"
import DialogComponent from "./Dialog"

const IMAGES = [
    "/cta/1.jpg",
    "/cta/2.jpg",
    "/cta/3.jpg",
    "/cta/4.jpg",
]

export default function CTA() {
    return (
        <section className="py-32 flex flex-col items-center justify-center bg-gray-50" id="contact">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-8 py-12 md:grid-cols-2">
                <ContainerStagger>
                    <ContainerAnimated className="mb-4 block text-xs font-medium text-rose-500 md:text-sm">
                        UI Components, Ready to Ship
                    </ContainerAnimated>
                    <ContainerAnimated className="text-4xl font-semibold md:text-[2.4rem] tracking-tight">
                        Build Modern UIs Faster
                    </ContainerAnimated>
                    <ContainerAnimated className="my-4 text-base text-slate-700 md:my-6 md:text-lg">
                        A production-ready UI component library for React and Tailwind CSS.
                        Accessible, themeable, and engineered for speed so you can ship
                        beautiful apps without reinventing the basics.
                    </ContainerAnimated>
                    <ContainerAnimated>
                        <DialogComponent />
                    </ContainerAnimated>
                </ContainerStagger>

                <GalleryGrid>
                    {IMAGES.map((imageUrl, index) => (
                        <GalleryGridCell index={index} key={index}>
                            <img
                                className="size-full object-cover object-center"
                                width="100%"
                                height="100%"
                                src={imageUrl}
                                alt=""
                            />
                        </GalleryGridCell>
                    ))}
                </GalleryGrid>
            </div>
        </section>
    )
}
