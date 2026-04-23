import svgPaths from "./svg-w8b4pjuxck";
import clsx from "clsx";
import imgImageWithFallback from "figma:asset/f3e677cbb576077f65042c261c4c513f671b9831.png";
import imgContainer from "figma:asset/9938406f869f434a483059a1c11f55c983296ad9.png";
import imgContainer1 from "figma:asset/0be31a37458426fc7da49492e5361f3db3fcf448.png";
import imgContainer2 from "figma:asset/2dfc6ee5ee28b68a9613e7257c35584c9d43a2d0.png";
import imgContainer3 from "figma:asset/cc1ae5cc9e1304b998c0b92a307a7d1160a21ba3.png";
import imgContainer4 from "figma:asset/70e0fd7a8e09a6663292f4fcd613336815a0fe90.png";

function ButtonBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white h-[56px] relative rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-[280px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[16px] px-[32px] relative size-full">{children}</div>
    </div>
  );
}

function ListBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start px-[24px] py-0 relative w-full">{children}</div>
    </div>
  );
}

function ContainerBackgroundImage5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow h-[52px] min-h-px min-w-px relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">{children}</div>
    </div>
  );
}

function ContainerBackgroundImage4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute h-[256px] left-0 top-0 w-[590px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

function ContainerBackgroundImage3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-[384px]">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">{children}</div>
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
    </div>
  );
}
type ButtonBackgroundImageProps = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ButtonBackgroundImageProps>) {
  return (
    <div className={clsx("basis-0 bg-gradient-to-r grow h-[56px] min-h-px min-w-[294px] relative rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] pb-0 pt-[16px] px-[24px] relative size-full">{children}</div>
    </div>
  );
}
type TextBackgroundImageProps = {
  additionalClassNames?: string;
};

function TextBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<TextBackgroundImageProps>) {
  return (
    <div className={clsx("h-[24px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type ContainerBackgroundImage2Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage2Props>) {
  return (
    <div className={clsx("basis-0 grow min-h-px min-w-px relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage3Props = {
  additionalClassNames?: string;
};

function BackgroundImage3({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage3Props>) {
  return (
    <div className={clsx("relative shrink-0 size-[48px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white relative rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] shrink-0 size-[64px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute h-[24px] left-[32px] top-[108px] w-[318px]">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
    </div>
  );
}

function IconBackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function IconBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function IconBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function ContainerBackgroundImage1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">
        <div className="h-[24px] relative shrink-0 w-[406px]">
          <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>{`Système d'évaluation`}</p>
        </div>
        <div className="content-stretch flex items-start relative shrink-0 w-full">
          <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#4a5565] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            {"Consultez et partagez des avis pour choisir les meilleurs fournisseurs"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ContainerBackgroundImage() {
  return (
    <BackgroundImage3 additionalClassNames="bg-[#f0f9ff] rounded-[16.4px]">
      <BackgroundImage>
        <path d={svgPaths.p9b81900} id="Vector" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </BackgroundImage>
    </BackgroundImage3>
  );
}
type HeadingBackgroundImageAndText1Props = {
  text: string;
};

function HeadingBackgroundImageAndText1({ text }: HeadingBackgroundImageAndText1Props) {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-0 text-[18px] text-nowrap text-white top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return <BackgroundImage1>{text}</BackgroundImage1>;
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText({ text, additionalClassNames = "" }: BackgroundImageAndTextProps) {
  return (
    <div className={clsx("content-stretch flex items-center justify-center py-0 relative w-full", additionalClassNames)}>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#4a5565] text-[14px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}

export default function IPhone16ProMax() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-center pb-[126px] pt-0 px-0 relative size-full" data-name="iPhone 16 Pro Max - 1">
      <div className="absolute bg-white content-stretch flex h-[160px] items-start left-0 pb-px pt-[80px] px-[31px] top-0 w-[549px]" data-name="LandingPage">
        <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none shadow-[0px_4px_23.4px_0px_rgba(0,0,0,0.21)]" />
        <div className="basis-0 content-stretch flex grow h-[48px] items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Container">
          <div className="h-[48px] relative shrink-0 w-[166.422px]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
              <div className="relative rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[44px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 187, 167) 0%, rgb(0, 150, 137) 100%)" }}>
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                  <BackgroundImage>
                    <path d={svgPaths.p3bfee9c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M12 22V12" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M3.29 7L12 12L20.71 7" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M7.5 4.27L16.5 9.42" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </BackgroundImage>
                </div>
              </div>
              <ContainerBackgroundImage2 additionalClassNames="h-[48px]">
                <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 1">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[32px] left-0 text-[#00786f] text-[24px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                    DawaLink
                  </p>
                </div>
                <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Votre partenaire B2B
                  </p>
                </div>
              </ContainerBackgroundImage2>
            </div>
          </div>
          <div className="h-[46px] relative rounded-[16.4px] shrink-0 w-[143.125px]" data-name="Button">
            <div aria-hidden="true" className="absolute border border-[#96f7e4] border-solid inset-0 pointer-events-none rounded-[16.4px]" />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[72px] text-[#00786f] text-[16px] text-center text-nowrap top-[11px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Se connecter
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full">
        <div className="content-start flex flex-wrap gap-[24px] items-start pb-0 pt-[192px] px-[32px] relative w-full">
          <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-[372.5px] relative shrink-0">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
                <div className="bg-white h-[38px] relative rounded-[3.35544e+07px] shrink-0 w-[253.766px]" data-name="Container">
                  <div aria-hidden="true" className="absolute border border-[#cbfbf1] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
                  <div className="absolute bg-[#00bba7] left-[17px] opacity-[0.501] rounded-[3.35544e+07px] size-[8px] top-[15px]" data-name="Container" />
                  <div className="absolute h-[20px] left-[33px] top-[9px] w-[203.766px]" data-name="Text">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#364153] text-[14px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Plateforme B2B Pharmaceutique
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="content-end flex flex-wrap gap-[8px] items-end relative shrink-0" data-name="Heading 2">
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[25px] relative shrink-0 text-[#101828] text-[20px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Connectez
                    </p>
                    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-[115.344px]" data-name="Text">
                      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[25px] relative shrink-0 text-[#009689] text-[20px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Fournisseurs
                      </p>
                    </div>
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[25px] relative shrink-0 text-[#101828] text-[20px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      et
                    </p>
                    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-[105.969px]" data-name="Text">
                      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[25px] relative shrink-0 text-[#0084d1] text-[20px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Pharmacies
                      </p>
                    </div>
                  </div>
                  <div className="content-start flex flex-wrap gap-[10px] items-start relative shrink-0 w-full" data-name="Paragraph">
                    <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[32.5px] min-h-px min-w-px relative shrink-0 text-[#4a5565] text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`La plateforme qui simplifie l'approvisionnement en médicaments en Algérie. Trouvez vos produits, contactez les agents commerciaux directement.`}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_fit-content(100%))] relative shrink-0 w-full" data-name="Container">
                <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[4px] h-[60px] items-start justify-self-stretch relative shrink-0" data-name="Container">
                  <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Paragraph">
                    <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[36px] min-h-px min-w-px relative shrink-0 text-[#009689] text-[30px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                      500+
                    </p>
                  </div>
                  <div className="relative shrink-0 w-full" data-name="Paragraph">
                    <div className="flex flex-row items-center justify-center size-full">
                      <BackgroundImageAndText text="Produits" additionalClassNames="px-[30px]" />
                    </div>
                  </div>
                </div>
                <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[4px] h-[60px] items-start justify-self-stretch relative shrink-0" data-name="Container">
                  <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Paragraph">
                    <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[36px] min-h-px min-w-px relative shrink-0 text-[#0084d1] text-[30px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                      150+
                    </p>
                  </div>
                  <div className="relative shrink-0 w-full" data-name="Paragraph">
                    <div className="flex flex-row items-center justify-center size-full">
                      <BackgroundImageAndText text="Pharmacies" additionalClassNames="px-[19px]" />
                    </div>
                  </div>
                </div>
                <div className="[grid-area:1_/_3] content-stretch flex flex-col gap-[4px] h-[60px] items-start justify-self-stretch relative shrink-0" data-name="Container">
                  <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Paragraph">
                    <p className="basis-0 font-['Roboto:Regular','Noto_Sans:Regular',sans-serif] font-normal grow leading-[36px] min-h-px min-w-px relative shrink-0 text-[#9810fa] text-[30px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                      4.8★
                    </p>
                  </div>
                  <div className="relative shrink-0 w-full" data-name="Paragraph">
                    <div className="flex flex-row items-center justify-center size-full">
                      <BackgroundImageAndText text="Satisfaction" additionalClassNames="px-[52px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-start flex flex-wrap gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
              <ButtonBackgroundImage additionalClassNames="from-[#0084d1] to-[#0069a8]">
                <div className="content-stretch flex gap-[8px] h-[24px] items-center justify-center relative shrink-0 w-full" data-name="Container">
                  <IconBackgroundImage>
                    <path d={svgPaths.p2e8a9780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p3384600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p18919800} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage>
                  <TextBackgroundImage additionalClassNames="w-[131px]">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[65px] text-[16px] text-center text-nowrap text-white top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Je suis Pharmacie
                    </p>
                  </TextBackgroundImage>
                </div>
              </ButtonBackgroundImage>
              <ButtonBackgroundImage additionalClassNames="from-[#009689] to-[#00786f]">
                <div className="content-stretch flex gap-[8px] h-[24px] items-center justify-center relative shrink-0 w-full" data-name="Container">
                  <IconBackgroundImage>
                    <path d="M8.33333 10H11.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M8.33333 6.66667H11.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p16bb4600} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p3b103700} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p24196980} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage>
                  <TextBackgroundImage additionalClassNames="w-[138.5px]">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[69.5px] text-[16px] text-center text-nowrap text-white top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Je suis Fournisseur
                    </p>
                  </TextBackgroundImage>
                </div>
              </ButtonBackgroundImage>
            </div>
          </div>
          <div className="basis-0 content-stretch flex grow h-[469px] items-center min-h-px min-w-[373px] relative shrink-0" data-name="Container">
            <div className="basis-0 content-stretch flex flex-col gap-[10px] grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="Container">
              <div className="absolute bg-gradient-to-r blur-2xl filter from-[#00d5be] h-[393px] left-0 opacity-20 rounded-[24px] to-[#00bcff] top-[34px] w-[400px]" data-name="Container" />
              <div className="basis-0 grow min-h-px min-w-px relative rounded-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="ImageWithFallback">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[32px] size-full" src={imgImageWithFallback} />
                <div className="size-full" />
              </div>
              <div className="absolute bg-white content-stretch flex flex-col h-[82px] items-start left-[15px] pb-px pt-[17px] px-[17px] rounded-[16.4px] top-[298px] w-[337px]" data-name="Container">
                <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[16.4px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
                <div className="content-stretch flex gap-[12px] h-[48px] items-center relative shrink-0 w-full" data-name="Container">
                  <BackgroundImage3 additionalClassNames="bg-[#d0fae5] rounded-[10px]">
                    <BackgroundImage>
                      <path d={svgPaths.p1f023100} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <path d="M9 11L12 14L22 4" id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </BackgroundImage>
                  </BackgroundImage3>
                  <ContainerBackgroundImage2 additionalClassNames="h-[36px]">
                    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#101828] text-[14px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Vérification
                      </p>
                    </div>
                    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#4a5565] text-[12px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                        100% Sécurisée
                      </p>
                    </div>
                  </ContainerBackgroundImage2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="Section">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-[64px] items-center pb-0 pt-[50px] px-[32px] relative w-full">
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
              <div className="relative shrink-0 w-full" data-name="Heading 3">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center px-[495px] py-0 relative w-full">
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#101828] text-[24px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Pourquoi choisir DawaLink ?
                    </p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Paragraph">
                <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#4a5565] text-[20px] text-center w-[328px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Une plateforme complète conçue pour faciliter les échanges entre professionnels de la santé
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[34px] items-start relative shrink-0 w-full" data-name="Container">
                <ContainerBackgroundImage3>
                  <div className="content-stretch flex flex-col h-[192px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgContainer} />
                    <div className="h-[192px] shrink-0 w-full" data-name="ImageWithFallback" />
                  </div>
                  <div className="h-[280px] relative shrink-0 w-full" data-name="Container">
                    <div className="absolute content-stretch flex items-center justify-center left-[32px] rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[56px] top-[32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 187, 167) 0%, rgb(0, 150, 137) 100%)" }}>
                      <IconBackgroundImage1>
                        <path d={svgPaths.p1a3063b0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                      </IconBackgroundImage1>
                    </div>
                    <HeadingBackgroundImageAndText text="Vérification Sécurisée" />
                    <div className="absolute h-[104px] left-[32px] top-[144px] w-[318px]" data-name="Paragraph">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-0 w-[303px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Tous les fournisseurs et pharmacies sont minutieusement vérifiés par nos administrateurs pour garantir la sécurité et la conformité.
                      </p>
                    </div>
                  </div>
                </ContainerBackgroundImage3>
                <ContainerBackgroundImage3>
                  <div className="content-stretch flex flex-col h-[192px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgContainer1} />
                    <div className="h-[192px] shrink-0 w-full" data-name="ImageWithFallback" />
                  </div>
                  <div className="h-[280px] relative shrink-0 w-full" data-name="Container">
                    <div className="absolute content-stretch flex items-center justify-center left-[32px] rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[56px] top-[32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 166, 244) 0%, rgb(0, 132, 209) 100%)" }}>
                      <IconBackgroundImage1>
                        <path d={svgPaths.p184ba090} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                        <path d={svgPaths.p182f3148} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                        <path d={svgPaths.p2f1426c0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                        <path d={svgPaths.p5d36b00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                      </IconBackgroundImage1>
                    </div>
                    <BackgroundImage1>{`Contact Direct & Rapide`}</BackgroundImage1>
                    <div className="absolute h-[104px] left-[32px] top-[144px] w-[318px]" data-name="Paragraph">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-0 w-[245px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Contactez directement les agents commerciaux via téléphone, email, WhatsApp ou réseaux sociaux. Communication instantanée.
                      </p>
                    </div>
                  </div>
                </ContainerBackgroundImage3>
                <ContainerBackgroundImage3>
                  <div className="content-stretch flex flex-col h-[192px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgContainer2} />
                    <div className="h-[192px] shrink-0 w-full" data-name="ImageWithFallback" />
                  </div>
                  <div className="h-[254px] relative shrink-0 w-full" data-name="Container">
                    <div className="absolute content-stretch flex items-center justify-center left-[32px] rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[56px] top-[32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(173, 70, 255) 0%, rgb(152, 16, 250) 100%)" }}>
                      <IconBackgroundImage1>
                        <path d={svgPaths.p38e2e780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                      </IconBackgroundImage1>
                    </div>
                    <HeadingBackgroundImageAndText text="Système de Notation" />
                    <div className="absolute h-[78px] left-[32px] top-[144px] w-[318px]" data-name="Paragraph">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-0 w-[288px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Évaluez les fournisseurs et consultez les avis vérifiés des autres pharmacies pour prendre les meilleures décisions.
                      </p>
                    </div>
                  </div>
                </ContainerBackgroundImage3>
              </div>
              <div className="bg-[#d9d9d9] h-[23px] relative rounded-[93px] shrink-0 w-full">
                <div className="content-stretch flex flex-col items-start px-[8px] py-[6px] relative size-full">
                  <div className="basis-0 bg-[#00786f] grow min-h-px min-w-px rounded-[93px] shrink-0 w-[118px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="Container">
        <div className="content-stretch flex flex-col gap-[21px] items-start pb-0 pt-[50px] px-[32px] relative w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
            <div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Heading 3">
              <div className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[28px] min-h-px min-w-px relative shrink-0 text-[#101828] text-[24px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="mb-0">{`Des fonctionnalités `}</p>
                <p>adaptées à vos besoins</p>
              </div>
            </div>
            <div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Paragraph">
              <div className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[28px] min-h-px min-w-px relative shrink-0 text-[#4a5565] text-[20px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="mb-0">{`Découvrez ce que DawaLink `}</p>
                <p>peut faire pour vous</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[40px] items-start justify-center relative shrink-0 w-full" data-name="Container">
            <div className="bg-white relative rounded-[24px] shrink-0 w-[395px]" data-name="Container">
              <div className="content-stretch flex flex-col gap-[40px] items-center overflow-clip pb-[32px] pt-0 px-0 relative rounded-[inherit] w-full">
                <div className="h-[256px] overflow-clip relative shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(147.053deg, rgb(223, 242, 254) 0%, rgb(184, 230, 254) 100%)" }}>
                  <div className="absolute h-[256px] left-0 opacity-90 top-0 w-[590px]" data-name="ImageWithFallback" />
                  <ContainerBackgroundImage4>
                    <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgContainer3} />
                    <div className="absolute bg-[rgba(0,0,0,0.55)] inset-0" />
                  </ContainerBackgroundImage4>
                  <div className="absolute content-stretch flex gap-[16px] h-[64px] items-center left-[24px] top-[168px] w-[295.172px]" data-name="Container">
                    <BackgroundImage2>
                      <IconBackgroundImage2>
                        <path d={svgPaths.p236ccf00} id="Vector" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                        <path d={svgPaths.p21aa0900} id="Vector_2" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                        <path d={svgPaths.p3618f700} id="Vector_3" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      </IconBackgroundImage2>
                    </BackgroundImage2>
                    <ContainerBackgroundImage5>
                      <HeadingBackgroundImageAndText1 text="Pour les Pharmacies" />
                      <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#dff2fe] text-[14px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Trouvez et commandez facilement
                        </p>
                      </div>
                    </ContainerBackgroundImage5>
                  </div>
                </div>
                {[...Array(4).keys()].map((_, i) => (
                  <ListBackgroundImage>
                    <div className="content-start flex flex-wrap gap-[16px] items-start relative shrink-0 w-full" data-name="List Item">
                      <ContainerBackgroundImage />
                      <ContainerBackgroundImage1 />
                    </div>
                  </ListBackgroundImage>
                ))}
              </div>
              <div aria-hidden="true" className="absolute border border-[#dff2fe] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
            </div>
            <div className="bg-white relative rounded-[24px] shrink-0 w-[395px]" data-name="Container">
              <div className="content-stretch flex flex-col gap-[40px] items-center overflow-clip pb-[32px] pt-0 px-0 relative rounded-[inherit] w-full">
                <div className="h-[256px] overflow-clip relative shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(147.053deg, rgb(203, 251, 241) 0%, rgb(150, 247, 228) 100%)" }}>
                  <div className="absolute h-[256px] left-0 opacity-90 top-0 w-[590px]" data-name="ImageWithFallback" />
                  <ContainerBackgroundImage4>
                    <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgContainer4} />
                    <div className="absolute bg-[rgba(0,0,0,0.55)] inset-0" />
                  </ContainerBackgroundImage4>
                  <div className="absolute content-stretch flex gap-[16px] h-[64px] items-center left-[24px] top-[168px] w-[289.078px]" data-name="Container">
                    <BackgroundImage2>
                      <IconBackgroundImage2>
                        <path d="M13.3333 16H18.6667" id="Vector" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                        <path d="M13.3333 10.6667H18.6667" id="Vector_2" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                        <path d={svgPaths.p1188a00} id="Vector_3" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                        <path d={svgPaths.p15a2c80} id="Vector_4" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                        <path d={svgPaths.p343cd80} id="Vector_5" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      </IconBackgroundImage2>
                    </BackgroundImage2>
                    <ContainerBackgroundImage5>
                      <HeadingBackgroundImageAndText1 text="Pour les Fournisseurs" />
                      <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#cbfbf1] text-[14px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Gérez et développez votre activité
                        </p>
                      </div>
                    </ContainerBackgroundImage5>
                  </div>
                </div>
                <div className="relative shrink-0 w-full" data-name="List">
                  <div className="content-stretch flex flex-col gap-[20px] items-start px-[24px] py-0 relative w-full">
                    {[...Array(4).keys()].map((_, i) => (
                      <ListBackgroundImage>
                        <div className="content-start flex flex-wrap gap-[16px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage />
                          <ContainerBackgroundImage1 />
                        </div>
                      </ListBackgroundImage>
                    ))}
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#cbfbf1] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
            </div>
          </div>
          <div className="bg-[rgba(217,217,217,0)] h-[23px] relative rounded-[93px] shrink-0 w-full">
            <div className="content-stretch flex flex-col items-start px-[203px] py-0 relative size-full">
              <div className="bg-[#d9d9d9] h-[23px] relative rounded-[93px] shrink-0 w-full">
                <div className="content-stretch flex flex-col items-start px-[7px] py-[6px] relative size-full">
                  <div className="basis-0 bg-[#00786f] grow min-h-px min-w-px rounded-[93px] shrink-0 w-[170px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="Section" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 0%), linear-gradient(rgba(0, 0, 0, 0.05) 0.25773%, rgba(0, 0, 0, 0) 0.25773%), linear-gradient(137.221deg, rgb(0, 150, 137) 0%, rgb(0, 120, 111) 50%, rgb(0, 105, 168) 100%)" }}>
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-start px-[32px] py-[96px] relative w-full">
            <div className="relative shrink-0 w-full" data-name="Container">
              <div className="flex flex-col items-center size-full">
                <div className="content-stretch flex flex-col gap-[40px] items-center px-[32px] py-0 relative w-full">
                  <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
                    <div className="relative shrink-0 w-full" data-name="Heading 3">
                      <div className="flex flex-row items-center justify-center size-full">
                        <div className="content-stretch flex items-center justify-center px-[527px] py-0 relative w-full">
                          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[18px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Prêt à commencer ?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative shrink-0 w-full" data-name="Paragraph">
                      <div className="flex flex-row items-center justify-center size-full">
                        <div className="content-stretch flex items-center justify-center p-[10px] relative w-full">
                          <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[28px] min-h-px min-w-px relative shrink-0 text-[#cbfbf1] text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`Rejoignez DawaLink aujourd'hui et découvrez une nouvelle façon de gérer votre activité pharmaceutique`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-start flex flex-wrap gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
                    <ButtonBackgroundImage1>
                      <div className="content-stretch flex gap-[8px] h-[24px] items-center justify-center relative shrink-0 w-full" data-name="Container">
                        <IconBackgroundImage>
                          <path d={svgPaths.p2e8a9780} id="Vector" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p1d2fb960} id="Vector_2" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p35167c00} id="Vector_3" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </IconBackgroundImage>
                        <TextBackgroundImage additionalClassNames="w-[155.688px]">
                          <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[78px] text-[#0069a8] text-[16px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Inscription Pharmacie
                          </p>
                        </TextBackgroundImage>
                      </div>
                    </ButtonBackgroundImage1>
                    <ButtonBackgroundImage1>
                      <div className="content-stretch flex gap-[8px] h-[24px] items-center justify-center relative shrink-0 w-full" data-name="Container">
                        <IconBackgroundImage>
                          <path d="M8.33333 10H11.6667" id="Vector" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d="M8.33333 6.66667H11.6667" id="Vector_2" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p16bb4600} id="Vector_3" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p3b103700} id="Vector_4" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                          <path d={svgPaths.p24196980} id="Vector_5" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </IconBackgroundImage>
                        <TextBackgroundImage additionalClassNames="w-[163.188px]">
                          <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[82px] text-[#00786f] text-[16px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Inscription Fournisseur
                          </p>
                        </TextBackgroundImage>
                      </div>
                    </ButtonBackgroundImage1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}