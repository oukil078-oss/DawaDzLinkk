import svgPaths from "./svg-to3kbr20yl";
import clsx from "clsx";
import imgContainer from "figma:asset/9938406f869f434a483059a1c11f55c983296ad9.png";
import imgContainer1 from "figma:asset/0be31a37458426fc7da49492e5361f3db3fcf448.png";
import imgContainer2 from "figma:asset/2dfc6ee5ee28b68a9613e7257c35584c9d43a2d0.png";
import imgContainer3 from "figma:asset/cc1ae5cc9e1304b998c0b92a307a7d1160a21ba3.png";
import imgContainer4 from "figma:asset/70e0fd7a8e09a6663292f4fcd613336815a0fe90.png";
import imgImageWithFallback from "figma:asset/f3e677cbb576077f65042c261c4c513f671b9831.png";
type ContainerBackgroundImage5Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage5({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage5Props>) {
  return (
    <div className={clsx("basis-0 grow min-h-px min-w-px relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage7Props = {
  additionalClassNames?: string;
};

function BackgroundImage7({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage7Props>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
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
type BackgroundImage6Props = {
  additionalClassNames?: string;
};

function BackgroundImage6({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage6Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImage5Props = {
  additionalClassNames?: string;
};

function BackgroundImage5({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage5Props>) {
  return <BackgroundImage6 additionalClassNames={clsx("h-[48px] relative shrink-0", additionalClassNames)}>{children}</BackgroundImage6>;
}
type ContainerBackgroundImage3Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage3({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage3Props>) {
  return <BackgroundImage6 additionalClassNames={clsx("basis-0 grow min-h-px min-w-px relative shrink-0", additionalClassNames)}>{children}</BackgroundImage6>;
}

function BackgroundImage4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white relative rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] shrink-0 size-[64px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}
type ContainerBackgroundImage2Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage2Props>) {
  return (
    <div className={clsx("relative shrink-0 size-[48px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute h-[24px] left-[32px] top-[108px] w-[318px]">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute content-stretch flex h-[36px] items-start left-0 top-[80px] w-[280px]">
      <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[36px] min-h-px min-w-px relative shrink-0 text-[#101828] text-[30px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </p>
    </div>
  );
}

function ButtonBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 bg-white grow h-[56px] min-h-px min-w-px relative rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[16px] px-[32px] relative size-full">{children}</div>
      </div>
    </div>
  );
}
type ButtonBackgroundImageProps = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ButtonBackgroundImageProps>) {
  return (
    <div className={clsx("basis-0 bg-gradient-to-r grow h-[56px] min-h-px min-w-px relative rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0", additionalClassNames)}>
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[16px] px-[24px] relative size-full">{children}</div>
      </div>
    </div>
  );
}

function IconBackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function IconBackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type ContainerBackgroundImage1Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImage1Props>) {
  return (
    <div className={clsx("bg-white place-self-stretch relative rounded-[16px] shrink-0", additionalClassNames)}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">{children}</div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function IconBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
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
type LinkBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function LinkBackgroundImageAndText({ text, additionalClassNames = "" }: LinkBackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute content-stretch flex h-[19px] items-start left-0 top-[2px]", additionalClassNames)}>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#99a1af] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type HeadingBackgroundImageAndText1Props = {
  text: string;
  additionalClassNames?: string;
};

function HeadingBackgroundImageAndText1({ text, additionalClassNames = "" }: HeadingBackgroundImageAndText1Props) {
  return (
    <div className={clsx("h-[24px] relative shrink-0", additionalClassNames)}>
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-nowrap text-white top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type ContainerBackgroundImageProps = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage({ additionalClassNames = "" }: ContainerBackgroundImageProps) {
  return (
    <div style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 187, 167) 0%, rgb(0, 150, 137) 100%)" }} className={clsx("relative rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <BackgroundImage>
          <path d={svgPaths.p3bfee9c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 22V12" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3.29 7L12 12L20.71 7" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M7.5 4.27L16.5 9.42" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </BackgroundImage>
      </div>
    </div>
  );
}
type ParagraphBackgroundImageAndText1Props = {
  text: string;
};

function ParagraphBackgroundImageAndText1({ text }: ParagraphBackgroundImageAndText1Props) {
  return <BackgroundImage1>{text}</BackgroundImage1>;
}
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-0 text-[18px] text-nowrap text-white top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type ParagraphBackgroundImageAndTextProps = {
  text: string;
};

function ParagraphBackgroundImageAndText({ text }: ParagraphBackgroundImageAndTextProps) {
  return (
    <div className="h-[20px] relative shrink-0 w-full">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type BackgroundImageAndText1Props = {
  text: string;
};

function BackgroundImageAndText1({ text }: BackgroundImageAndText1Props) {
  return <BackgroundImage3>{text}</BackgroundImage3>;
}
type BackgroundImageAndTextProps = {
  text: string;
};

function BackgroundImageAndText({ text }: BackgroundImageAndTextProps) {
  return <BackgroundImage2>{text}</BackgroundImage2>;
}

export default function ECommerceWebsiteUiUxDesign() {
  return (
    <div className="bg-white relative size-full" data-name="E-commerce Website UI/UX Design">
      <div className="absolute bg-white h-[3634px] left-0 top-0 w-[1529px]" data-name="LandingPage">
        <div className="absolute bg-white content-stretch flex flex-col gap-[64px] h-[830px] items-start left-0 pb-0 pt-[96px] px-[156.5px] top-[741px] w-[1529px]" data-name="Section">
          <div className="h-[100px] relative shrink-0 w-full" data-name="Container">
            <div className="absolute h-[28px] left-0 top-0 w-[1216px]" data-name="Heading 3">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-[608.06px] text-[#101828] text-[18px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Pourquoi choisir DawaLink ?
              </p>
            </div>
            <div className="absolute h-[56px] left-[224px] top-[44px] w-[768px]" data-name="Paragraph">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-[384.13px] text-[#4a5565] text-[20px] text-center top-[-1px] translate-x-[-50%] w-[748px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Une plateforme complète conçue pour faciliter les échanges entre professionnels de la santé
              </p>
            </div>
          </div>
          <div className="gap-[32px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[474px] relative shrink-0 w-full" data-name="Container">
            <ContainerBackgroundImage1 additionalClassNames="[grid-area:1_/_1]">
              <div className="content-stretch flex flex-col h-[192px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgContainer} />
                <div className="h-[192px] shrink-0 w-full" data-name="ImageWithFallback" />
              </div>
              <div className="h-[280px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex items-center justify-center left-[32px] rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[56px] top-[32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 187, 167) 0%, rgb(0, 150, 137) 100%)" }}>
                  <IconBackgroundImage>
                    <path d={svgPaths.p1a3063b0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                  </IconBackgroundImage>
                </div>
                <BackgroundImageAndText1 text="Vérification Sécurisée" />
                <div className="absolute h-[104px] left-[32px] top-[144px] w-[318px]" data-name="Paragraph">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-0 w-[303px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Tous les fournisseurs et pharmacies sont minutieusement vérifiés par nos administrateurs pour garantir la sécurité et la conformité.
                  </p>
                </div>
              </div>
            </ContainerBackgroundImage1>
            <ContainerBackgroundImage1 additionalClassNames="[grid-area:1_/_2]">
              <div className="content-stretch flex flex-col h-[192px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgContainer1} />
                <div className="h-[192px] shrink-0 w-full" data-name="ImageWithFallback" />
              </div>
              <div className="h-[280px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex items-center justify-center left-[32px] rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[56px] top-[32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 166, 244) 0%, rgb(0, 132, 209) 100%)" }}>
                  <IconBackgroundImage>
                    <path d={svgPaths.p184ba090} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                    <path d={svgPaths.p182f3148} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                    <path d={svgPaths.p2f1426c0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                    <path d={svgPaths.p5d36b00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                  </IconBackgroundImage>
                </div>
                <BackgroundImage3>{`Contact Direct & Rapide`}</BackgroundImage3>
                <div className="absolute h-[104px] left-[32px] top-[144px] w-[318px]" data-name="Paragraph">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-0 w-[245px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Contactez directement les agents commerciaux via téléphone, email, WhatsApp ou réseaux sociaux. Communication instantanée.
                  </p>
                </div>
              </div>
            </ContainerBackgroundImage1>
            <ContainerBackgroundImage1 additionalClassNames="[grid-area:1_/_3]">
              <div className="content-stretch flex flex-col h-[192px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgContainer2} />
                <div className="h-[192px] shrink-0 w-full" data-name="ImageWithFallback" />
              </div>
              <div className="h-[254px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex items-center justify-center left-[32px] rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[56px] top-[32px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(173, 70, 255) 0%, rgb(152, 16, 250) 100%)" }}>
                  <IconBackgroundImage>
                    <path d={svgPaths.p38e2e780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                  </IconBackgroundImage>
                </div>
                <BackgroundImageAndText1 text="Système de Notation" />
                <div className="absolute h-[78px] left-[32px] top-[144px] w-[318px]" data-name="Paragraph">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[26px] left-0 text-[#4a5565] text-[16px] top-0 w-[288px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Évaluez les fournisseurs et consultez les avis vérifiés des autres pharmacies pour prendre les meilleures décisions.
                  </p>
                </div>
              </div>
            </ContainerBackgroundImage1>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col h-[978px] items-start left-0 pb-0 pt-[96px] px-[124.5px] top-[1571px] w-[1529px]" data-name="Section" style={{ backgroundImage: "linear-gradient(147.396deg, rgb(249, 250, 251) 0%, rgb(255, 255, 255) 50%, rgb(249, 250, 251) 100%)" }}>
          <div className="h-[786px] relative shrink-0 w-full" data-name="Container">
            <div className="size-full">
              <div className="content-stretch flex flex-col gap-[64px] items-start px-[32px] py-0 relative size-full">
                <div className="content-stretch flex flex-col gap-[16px] h-[72px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-[608.3px] text-[#101828] text-[18px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Des fonctionnalités adaptées à vos besoins
                    </p>
                  </div>
                  <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-[607.5px] text-[#4a5565] text-[20px] text-center text-nowrap top-[-1px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Découvrez ce que DawaLink peut faire pour vous
                    </p>
                  </div>
                </div>
                <div className="gap-[32px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[650px] relative shrink-0 w-full" data-name="Container">
                  <div className="[grid-area:1_/_1] bg-white place-self-stretch relative rounded-[24px] shrink-0" data-name="Container">
                    <div className="overflow-clip relative rounded-[inherit] size-full">
                      <div className="absolute content-stretch flex flex-col gap-[20px] h-[312px] items-start left-[41px] top-[297px] w-[510px]" data-name="List">
                        <div className="content-stretch flex gap-[16px] h-[68px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage2 additionalClassNames="bg-[#f0f9ff] rounded-[16.4px]">
                            <BackgroundImage>
                              <path d="M21 21L16.66 16.66" id="Vector" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p19568f00} id="Vector_2" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </BackgroundImage>
                          </ContainerBackgroundImage2>
                          <ContainerBackgroundImage3 additionalClassNames="h-[68px]">
                            <BackgroundImageAndText text="Recherche intelligente" />
                            <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
                              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-0 w-[404px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                Trouvez instantanément vos médicaments par nom, référence ou catégorie avec filtres avancés
                              </p>
                            </div>
                          </ContainerBackgroundImage3>
                        </div>
                        <div className="content-stretch flex gap-[16px] h-[68px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage2 additionalClassNames="bg-[#f0f9ff] rounded-[16.4px]">
                            <BackgroundImage>
                              <path d={svgPaths.p1b8b3180} id="Vector" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </BackgroundImage>
                          </ContainerBackgroundImage2>
                          <ContainerBackgroundImage3 additionalClassNames="h-[68px]">
                            <BackgroundImageAndText text="Disponibilité en temps réel" />
                            <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
                              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-0 w-[430px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                Consultez les stocks et prix actualisés instantanément pour éviter les ruptures
                              </p>
                            </div>
                          </ContainerBackgroundImage3>
                        </div>
                        <div className="content-stretch flex gap-[16px] h-[68px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage2 additionalClassNames="bg-[#f0f9ff] rounded-[16.4px]">
                            <BackgroundImage>
                              <path d={svgPaths.p1d820380} id="Vector" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p27451300} id="Vector_2" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p2981fe00} id="Vector_3" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p161d4800} id="Vector_4" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </BackgroundImage>
                          </ContainerBackgroundImage2>
                          <ContainerBackgroundImage3 additionalClassNames="h-[68px]">
                            <BackgroundImageAndText text="Contact direct simplifié" />
                            <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
                              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-0 w-[406px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                Accédez aux coordonnées complètes et contactez via WhatsApp, téléphone ou email
                              </p>
                            </div>
                          </ContainerBackgroundImage3>
                        </div>
                        <div className="content-stretch flex gap-[16px] h-[48px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage2 additionalClassNames="bg-[#f0f9ff] rounded-[16.4px]">
                            <BackgroundImage>
                              <path d={svgPaths.p9b81900} id="Vector" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </BackgroundImage>
                          </ContainerBackgroundImage2>
                          <BackgroundImage5 additionalClassNames="w-[431.047px]">
                            <BackgroundImage2>{`Système d'évaluation`}</BackgroundImage2>
                            <ParagraphBackgroundImageAndText text="Consultez et partagez des avis pour choisir les meilleurs fournisseurs" />
                          </BackgroundImage5>
                        </div>
                      </div>
                      <div className="absolute h-[256px] left-px overflow-clip top-px w-[590px]" data-name="Container" style={{ backgroundImage: "linear-gradient(156.544deg, rgb(223, 242, 254) 0%, rgb(184, 230, 254) 100%)" }}>
                        <div className="absolute h-[256px] left-0 opacity-90 top-0 w-[590px]" data-name="ImageWithFallback" />
                        <ContainerBackgroundImage4>
                          <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgContainer3} />
                          <div className="absolute bg-[rgba(0,0,0,0.55)] inset-0" />
                        </ContainerBackgroundImage4>
                        <div className="absolute content-stretch flex gap-[16px] h-[64px] items-center left-[24px] top-[168px] w-[295.172px]" data-name="Container">
                          <BackgroundImage4>
                            <IconBackgroundImage1>
                              <path d={svgPaths.p236ccf00} id="Vector" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                              <path d={svgPaths.p21aa0900} id="Vector_2" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                              <path d={svgPaths.p3618f700} id="Vector_3" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                            </IconBackgroundImage1>
                          </BackgroundImage4>
                          <ContainerBackgroundImage3 additionalClassNames="h-[52px]">
                            <HeadingBackgroundImageAndText text="Pour les Pharmacies" />
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#dff2fe] text-[14px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                                Trouvez et commandez facilement
                              </p>
                            </div>
                          </ContainerBackgroundImage3>
                        </div>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#dff2fe] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
                  </div>
                  <div className="[grid-area:1_/_2] bg-white place-self-stretch relative rounded-[24px] shrink-0" data-name="Container">
                    <div className="overflow-clip relative rounded-[inherit] size-full">
                      <div className="absolute content-stretch flex flex-col gap-[20px] h-[292px] items-start left-[41px] top-[297px] w-[510px]" data-name="List">
                        <div className="content-stretch flex gap-[16px] h-[68px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage2 additionalClassNames="bg-[#f0fdfa] rounded-[16.4px]">
                            <BackgroundImage>
                              <path d={svgPaths.p3bfee9c0} id="Vector" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d="M12 22V12" id="Vector_2" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d="M3.29 7L12 12L20.71 7" id="Vector_3" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d="M7.5 4.27L16.5 9.42" id="Vector_4" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </BackgroundImage>
                          </ContainerBackgroundImage2>
                          <ContainerBackgroundImage3 additionalClassNames="h-[68px]">
                            <BackgroundImageAndText text="Gestion de catalogue simplifiée" />
                            <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
                              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-0 w-[398px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                Ajoutez vos produits manuellement ou importez votre catalogue complet via Excel
                              </p>
                            </div>
                          </ContainerBackgroundImage3>
                        </div>
                        <div className="content-stretch flex gap-[16px] h-[68px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage2 additionalClassNames="bg-[#f0fdfa] rounded-[16.4px]">
                            <BackgroundImage>
                              <path d={svgPaths.pb007f00} id="Vector" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p1b58ab00} id="Vector_2" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d="M9 15L11 17L15 13" id="Vector_3" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </BackgroundImage>
                          </ContainerBackgroundImage2>
                          <ContainerBackgroundImage3 additionalClassNames="h-[68px]">
                            <BackgroundImageAndText text="Mises à jour instantanées" />
                            <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
                              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-0 w-[431px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                Modifiez prix, stocks et disponibilités en temps réel pour informer vos clients
                              </p>
                            </div>
                          </ContainerBackgroundImage3>
                        </div>
                        <div className="content-stretch flex gap-[16px] h-[48px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage2 additionalClassNames="bg-[#f0fdfa] rounded-[16.4px]">
                            <BackgroundImage>
                              <path d={svgPaths.p1d820380} id="Vector" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p27451300} id="Vector_2" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p2981fe00} id="Vector_3" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p161d4800} id="Vector_4" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </BackgroundImage>
                          </ContainerBackgroundImage2>
                          <BackgroundImage5 additionalClassNames="w-[445.703px]">
                            <BackgroundImage2>{`Réseau d'agents commerciaux`}</BackgroundImage2>
                            <ParagraphBackgroundImageAndText text="Gérez vos agents avec coordonnées complètes et liens réseaux sociaux" />
                          </BackgroundImage5>
                        </div>
                        <div className="content-stretch flex gap-[16px] h-[48px] items-start relative shrink-0 w-full" data-name="List Item">
                          <ContainerBackgroundImage2 additionalClassNames="bg-[#f0fdfa] rounded-[16.4px]">
                            <BackgroundImage>
                              <path d="M16 7H22V13" id="Vector" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              <path d={svgPaths.p13253c0} id="Vector_2" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </BackgroundImage>
                          </ContainerBackgroundImage2>
                          <BackgroundImage5 additionalClassNames="w-[435.875px]">
                            <BackgroundImageAndText text="Analyses et statistiques" />
                            <ParagraphBackgroundImageAndText text="Suivez vos performances, consultez les avis et améliorez votre service" />
                          </BackgroundImage5>
                        </div>
                      </div>
                      <div className="absolute h-[256px] left-px overflow-clip top-px w-[590px]" data-name="Container" style={{ backgroundImage: "linear-gradient(156.544deg, rgb(203, 251, 241) 0%, rgb(150, 247, 228) 100%)" }}>
                        <div className="absolute h-[256px] left-0 opacity-90 top-0 w-[590px]" data-name="ImageWithFallback" />
                        <ContainerBackgroundImage4>
                          <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgContainer4} />
                          <div className="absolute bg-[rgba(0,0,0,0.55)] inset-0" />
                        </ContainerBackgroundImage4>
                        <div className="absolute content-stretch flex gap-[16px] h-[64px] items-center left-[24px] top-[168px] w-[289.078px]" data-name="Container">
                          <BackgroundImage4>
                            <IconBackgroundImage1>
                              <path d="M13.3333 16H18.6667" id="Vector" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                              <path d="M13.3333 10.6667H18.6667" id="Vector_2" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                              <path d={svgPaths.p1188a00} id="Vector_3" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                              <path d={svgPaths.p15a2c80} id="Vector_4" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                              <path d={svgPaths.p343cd80} id="Vector_5" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                            </IconBackgroundImage1>
                          </BackgroundImage4>
                          <ContainerBackgroundImage3 additionalClassNames="h-[52px]">
                            <HeadingBackgroundImageAndText text="Pour les Fournisseurs" />
                            <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#cbfbf1] text-[14px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                                Gérez et développez votre activité
                              </p>
                            </div>
                          </ContainerBackgroundImage3>
                        </div>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#cbfbf1] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bg-white gap-[32px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[304px] left-0 px-[156.5px] py-[80px] top-[2549px] w-[1529px]" data-name="Section">
          <div className="[grid-area:1_/_1] place-self-stretch relative shrink-0" data-name="Container">
            <div className="absolute bg-[#f0fdfa] content-stretch flex items-center justify-center left-[108px] rounded-[16px] size-[64px] top-0" data-name="Container">
              <IconBackgroundImage1>
                <path d="M16 8V16L21.3333 18.6667" id="Vector" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d={svgPaths.p1dee4500} id="Vector_2" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              </IconBackgroundImage1>
            </div>
            <ParagraphBackgroundImageAndText1 text="24/7" />
            <div className="absolute h-[20px] left-0 top-[124px] w-[280px]" data-name="Paragraph">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[140.05px] text-[#4a5565] text-[14px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Disponibilité
              </p>
            </div>
          </div>
          <div className="[grid-area:1_/_2] place-self-stretch relative shrink-0" data-name="Container">
            <div className="absolute bg-[#f0f9ff] content-stretch flex items-center justify-center left-[108px] rounded-[16px] size-[64px] top-0" data-name="Container">
              <IconBackgroundImage1>
                <path d={svgPaths.pae2ff80} id="Vector" stroke="var(--stroke-0, #0084D1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              </IconBackgroundImage1>
            </div>
            <ParagraphBackgroundImageAndText1 text="100%" />
            <div className="absolute h-[20px] left-0 top-[124px] w-[280px]" data-name="Paragraph">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[140.2px] text-[#4a5565] text-[14px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Sécurisé
              </p>
            </div>
          </div>
          <div className="[grid-area:1_/_3] place-self-stretch relative shrink-0" data-name="Container">
            <div className="absolute bg-[#faf5ff] content-stretch flex items-center justify-center left-[108px] rounded-[16px] size-[64px] top-0" data-name="Container">
              <IconBackgroundImage1>
                <path d={svgPaths.p27a3200} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d={svgPaths.p3c1b880} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d={svgPaths.p16bbf900} id="Vector_3" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                <path d={svgPaths.p2ee517c0} id="Vector_4" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              </IconBackgroundImage1>
            </div>
            <ParagraphBackgroundImageAndText1 text="150+" />
            <div className="absolute h-[20px] left-0 top-[124px] w-[280px]" data-name="Paragraph">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[140.25px] text-[#4a5565] text-[14px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Partenaires
              </p>
            </div>
          </div>
          <div className="[grid-area:1_/_4] place-self-stretch relative shrink-0" data-name="Container">
            <div className="absolute bg-[#ecfdf5] content-stretch flex items-center justify-center left-[108px] rounded-[16px] size-[64px] top-0" data-name="Container">
              <IconBackgroundImage1>
                <path d={svgPaths.p32dc4e00} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
              </IconBackgroundImage1>
            </div>
            <BackgroundImage1>{`<2h`}</BackgroundImage1>
            <div className="absolute h-[20px] left-0 top-[124px] w-[280px]" data-name="Paragraph">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[139.5px] text-[#4a5565] text-[14px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Temps de réponse
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bg-[#101828] content-stretch flex flex-col gap-[48px] h-[329px] items-center justify-center left-0 top-[3305px] w-[1529px]" data-name="Footer">
          <div className="h-[160px] relative shrink-0 w-[1107px]" data-name="Container">
            <div className="absolute content-stretch flex flex-col gap-[16px] h-[160px] items-start left-0 top-0 w-[592px]" data-name="Container">
              <div className="content-stretch flex gap-[12px] h-[44px] items-center relative shrink-0 w-full" data-name="Container">
                <ContainerBackgroundImage additionalClassNames="size-[40px]" />
                <BackgroundImage7 additionalClassNames="h-[44px] w-[110.422px]">
                  <div className="absolute content-stretch flex h-[24px] items-start left-0 top-[2px] w-[86.734px]" data-name="Text">
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[20px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                      DawaLink
                    </p>
                  </div>
                  <div className="absolute h-[16px] left-0 top-[28px] w-[110.422px]" data-name="Paragraph">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Votre partenaire B2B
                    </p>
                  </div>
                </BackgroundImage7>
              </div>
              <div className="h-[48px] relative shrink-0 w-full" data-name="Paragraph">
                <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#99a1af] text-[16px] top-0 w-[559px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  La plateforme B2B qui connecte fournisseurs et pharmacies en Algérie pour un approvisionnement simplifié et sécurisé.
                </p>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col gap-[16px] h-[160px] items-start left-[624px] top-0 w-[280px]" data-name="Container">
              <HeadingBackgroundImageAndText1 text="Liens rapides" additionalClassNames="w-full" />
              <div className="content-stretch flex flex-col gap-[8px] h-[120px] items-start relative shrink-0 w-full" data-name="List">
                <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                  <LinkBackgroundImageAndText text="À propos" additionalClassNames="w-[64.156px]" />
                </div>
                <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                  <LinkBackgroundImageAndText text="Fonctionnalités" additionalClassNames="w-[109.406px]" />
                </div>
                <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                  <LinkBackgroundImageAndText text="Tarifs" additionalClassNames="w-[40.5px]" />
                </div>
                <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                  <LinkBackgroundImageAndText text="Contact" additionalClassNames="w-[55.922px]" />
                </div>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col gap-[16px] h-[160px] items-start left-[936px] top-0" data-name="Container">
              <HeadingBackgroundImageAndText1 text="Support" additionalClassNames="w-[126px]" />
              <div className="content-stretch flex flex-col gap-[8px] h-[120px] items-start relative shrink-0 w-[126px]" data-name="List">
                <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                  <div className="absolute content-stretch flex h-[19px] items-start left-0 top-[2px] w-[92.234px]" data-name="Link">
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#99a1af] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>{`Centre d'aide`}</p>
                  </div>
                </div>
                <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                  <LinkBackgroundImageAndText text="Documentation" additionalClassNames="w-[109.203px]" />
                </div>
                <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                  <LinkBackgroundImageAndText text="CGU" additionalClassNames="w-[31.688px]" />
                </div>
                <div className="h-[24px] relative shrink-0 w-full" data-name="List Item">
                  <LinkBackgroundImageAndText text="Confidentialité" additionalClassNames="w-[102.922px]" />
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col h-[57px] items-start pb-0 pt-[33px] px-0 relative shrink-0 w-[1107px]" data-name="Container">
            <div aria-hidden="true" className="absolute border-[#1e2939] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
            <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Paragraph">
              <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#99a1af] text-[16px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                © 2025 DawaLink. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute h-[660px] left-0 overflow-clip top-[81px] w-[1529px]" data-name="Section" style={{ backgroundImage: "linear-gradient(156.652deg, rgb(240, 253, 250) 0%, rgb(255, 255, 255) 50%, rgb(240, 249, 255) 100%)" }}>
          <div className="absolute h-[500px] left-[156.5px] top-[80px] w-[1216px]" data-name="Container">
            <div className="absolute h-[388.5px] left-0 top-[55.75px] w-[584px]" data-name="Container">
              <div className="absolute bg-white border border-[#cbfbf1] border-solid h-[38px] left-0 rounded-[3.35544e+07px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-0 w-[253.766px]" data-name="Container">
                <div className="absolute bg-[#00bba7] left-[16px] opacity-[0.501] rounded-[3.35544e+07px] size-[8px] top-[14px]" data-name="Container" />
                <div className="absolute h-[20px] left-[32px] top-[8px] w-[203.766px]" data-name="Text">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#364153] text-[14px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Plateforme B2B Pharmaceutique
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[16px] h-[138.5px] items-start left-0 top-[70px] w-[584px]" data-name="Container">
                <div className="h-[25px] relative shrink-0 w-full" data-name="Heading 2">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[25px] left-0 text-[#101828] text-[20px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Connectez
                  </p>
                  <div className="absolute content-stretch flex h-[24px] items-start left-[99.63px] top-0 w-[115.344px]" data-name="Text">
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[25px] relative shrink-0 text-[#009689] text-[20px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Fournisseurs
                    </p>
                  </div>
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[25px] left-[214.97px] text-[#101828] text-[20px] text-nowrap top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    et
                  </p>
                  <div className="absolute content-stretch flex h-[24px] items-start left-[242.05px] top-0 w-[105.969px]" data-name="Text">
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[25px] relative shrink-0 text-[#0084d1] text-[20px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Pharmacies
                    </p>
                  </div>
                </div>
                <div className="h-[97.5px] relative shrink-0 w-full" data-name="Paragraph">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[32.5px] left-0 text-[#4a5565] text-[20px] top-[-1px] w-[574px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`La plateforme qui simplifie l'approvisionnement en médicaments en Algérie. Trouvez vos produits, contactez les agents commerciaux directement.`}</p>
                </div>
              </div>
              <div className="absolute h-[60px] left-0 top-[240.5px] w-[584px]" data-name="Container">
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[60px] items-start left-0 top-0 w-[178.656px]" data-name="Container">
                  <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Paragraph">
                    <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[36px] min-h-px min-w-px relative shrink-0 text-[#009689] text-[30px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                      500+
                    </p>
                  </div>
                  <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[89.7px] text-[#4a5565] text-[14px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Produits
                    </p>
                  </div>
                </div>
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[60px] items-start left-[202.66px] top-0 w-[178.672px]" data-name="Container">
                  <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Paragraph">
                    <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[36px] min-h-px min-w-px relative shrink-0 text-[#0084d1] text-[30px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                      150+
                    </p>
                  </div>
                  <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[89.73px] text-[#4a5565] text-[14px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Pharmacies
                    </p>
                  </div>
                </div>
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[60px] items-start left-[405.33px] top-0 w-[178.672px]" data-name="Container">
                  <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Paragraph">
                    <p className="basis-0 font-['Roboto:Regular','Noto_Sans:Regular',sans-serif] font-normal grow leading-[36px] min-h-px min-w-px relative shrink-0 text-[#9810fa] text-[30px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                      4.8★
                    </p>
                  </div>
                  <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[89.5px] text-[#4a5565] text-[14px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Satisfaction
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex gap-[16px] h-[56px] items-start left-0 top-[332.5px] w-[584px]" data-name="Container">
                <ButtonBackgroundImage additionalClassNames="from-[#0084d1] to-[#0069a8]">
                  <div className="content-stretch flex gap-[8px] h-[24px] items-center justify-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage2>
                      <path d={svgPaths.p2e8a9780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p3384600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p18919800} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </IconBackgroundImage2>
                    <BackgroundImage7 additionalClassNames="h-[24px] w-[131px]">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[65px] text-[16px] text-center text-nowrap text-white top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Je suis Pharmacie
                      </p>
                    </BackgroundImage7>
                  </div>
                </ButtonBackgroundImage>
                <ButtonBackgroundImage additionalClassNames="from-[#009689] to-[#00786f]">
                  <div className="content-stretch flex gap-[8px] h-[24px] items-center justify-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage2>
                      <path d="M8.33333 10H11.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d="M8.33333 6.66667H11.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p16bb4600} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p3b103700} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d={svgPaths.p24196980} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </IconBackgroundImage2>
                    <BackgroundImage7 additionalClassNames="h-[24px] w-[138.5px]">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[69.5px] text-[16px] text-center text-nowrap text-white top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Je suis Fournisseur
                      </p>
                    </BackgroundImage7>
                  </div>
                </ButtonBackgroundImage>
              </div>
            </div>
            <div className="absolute h-[500px] left-[632px] top-0 w-[584px]" data-name="Container">
              <div className="absolute bg-gradient-to-r blur-2xl filter from-[#00d5be] h-[532px] left-[-16px] opacity-20 rounded-[24px] to-[#00bcff] top-[-16px] w-[616px]" data-name="Container" />
              <div className="absolute h-[500px] left-0 top-0 w-[584px]" data-name="Container">
                <div className="absolute h-[500px] left-0 rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] top-0 w-[584px]" data-name="ImageWithFallback">
                  <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImageWithFallback} />
                </div>
                <div className="absolute bg-white content-stretch flex flex-col h-[82px] items-start left-[-24px] pb-px pt-[17px] px-[17px] rounded-[16.4px] top-[442px] w-[178.297px]" data-name="Container">
                  <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[16.4px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" />
                  <div className="content-stretch flex gap-[12px] h-[48px] items-center relative shrink-0 w-full" data-name="Container">
                    <ContainerBackgroundImage2 additionalClassNames="bg-[#d0fae5] rounded-[10px]">
                      <BackgroundImage>
                        <path d={svgPaths.p1f023100} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M9 11L12 14L22 4" id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </BackgroundImage>
                    </ContainerBackgroundImage2>
                    <ContainerBackgroundImage5 additionalClassNames="h-[36px]">
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
                    </ContainerBackgroundImage5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute h-[388px] left-0 overflow-clip top-[2853px] w-[1529px]" data-name="Section" style={{ backgroundImage: "linear-gradient(165.761deg, rgb(0, 150, 137) 0%, rgb(0, 120, 111) 50%, rgb(0, 105, 168) 100%)" }}>
          <div className="absolute h-[388px] left-0 opacity-10 top-0 w-[1529px]" data-name="Container" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 0%), linear-gradient(rgba(0, 0, 0, 0.05) 0.25773%, rgba(0, 0, 0, 0) 0.25773%)" }} />
          <div className="absolute h-[196px] left-[124.5px] top-[96px] w-[1280px]" data-name="Container">
            <div className="absolute h-[28px] left-[32px] top-0 w-[1216px]" data-name="Heading 3">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-[608.38px] text-[18px] text-center text-nowrap text-white top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Prêt à commencer ?
              </p>
            </div>
            <div className="absolute h-[56px] left-[304px] top-[44px] w-[672px]" data-name="Paragraph">
              <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-[336.3px] text-[#cbfbf1] text-[20px] text-center top-[-1px] translate-x-[-50%] w-[650px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`Rejoignez DawaLink aujourd'hui et découvrez une nouvelle façon de gérer votre activité pharmaceutique`}</p>
            </div>
            <div className="absolute content-stretch flex gap-[16px] h-[56px] items-start justify-center left-[352px] top-[140px] w-[576px]" data-name="Container">
              <ButtonBackgroundImage1>
                <div className="content-stretch flex gap-[8px] h-[24px] items-center justify-center relative shrink-0 w-full" data-name="Container">
                  <IconBackgroundImage2>
                    <path d={svgPaths.p2e8a9780} id="Vector" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p1d2fb960} id="Vector_2" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p35167c00} id="Vector_3" stroke="var(--stroke-0, #0069A8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage2>
                  <BackgroundImage7 additionalClassNames="h-[24px] w-[155.688px]">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[78px] text-[#0069a8] text-[16px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Inscription Pharmacie
                    </p>
                  </BackgroundImage7>
                </div>
              </ButtonBackgroundImage1>
              <ButtonBackgroundImage1>
                <div className="content-stretch flex gap-[8px] h-[24px] items-center justify-center relative shrink-0 w-full" data-name="Container">
                  <IconBackgroundImage2>
                    <path d="M8.33333 10H11.6667" id="Vector" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d="M8.33333 6.66667H11.6667" id="Vector_2" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p16bb4600} id="Vector_3" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p3b103700} id="Vector_4" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.p24196980} id="Vector_5" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage2>
                  <BackgroundImage7 additionalClassNames="h-[24px] w-[163.188px]">
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[82px] text-[#00786f] text-[16px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Inscription Fournisseur
                    </p>
                  </BackgroundImage7>
                </div>
              </ButtonBackgroundImage1>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.9)] content-stretch flex flex-col h-[81px] items-start left-0 pb-px pt-[16px] px-[156.5px] top-0 w-[1529px]" data-name="LandingPage">
        <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
        <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Container">
          <div className="h-[48px] relative shrink-0 w-[166.422px]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
              <ContainerBackgroundImage additionalClassNames="size-[44px]" />
              <ContainerBackgroundImage5 additionalClassNames="h-[48px]">
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
              </ContainerBackgroundImage5>
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
    </div>
  );
}