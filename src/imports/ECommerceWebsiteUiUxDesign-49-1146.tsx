import svgPaths from "./svg-yroazepw6i";
import clsx from "clsx";
type BackgroundImage4Props = {
  additionalClassNames?: string;
};

function BackgroundImage4({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage4Props>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}

function ContainerBackgroundImage5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[11px] items-start p-[24px] relative w-full">{children}</div>
    </div>
  );
}

function BackgroundImage3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-[88.138px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">{children}</div>
    </div>
  );
}
type BackgroundImage2Props = {
  additionalClassNames?: string;
};

function BackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage2Props>) {
  return (
    <div className={clsx("relative rounded-[10px] shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        {children}
      </svg>
    </div>
  );
}
type IconBackgroundImageProps = {
  additionalClassNames?: string;
};

function IconBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<IconBackgroundImageProps>) {
  return (
    <div className={clsx("size-[20px]", additionalClassNames)}>
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
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#101828] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}

function ButtonBackgroundImage() {
  return (
    <div className="bg-[#0084d1] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[3px] py-[8px] relative w-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>{`Contacter `}</p>
        </div>
      </div>
    </div>
  );
}
type ContainerBackgroundImage4Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage4({ additionalClassNames = "" }: ContainerBackgroundImage4Props) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <ParagraphBackgroundImageAndText text="Fournisseur" additionalClassNames="items-center" />
      <BackgroundImageAndText text="Pharma Distribution SA" additionalClassNames="items-center" />
      <ContainerBackgroundImage3 />
    </div>
  );
}

function ContainerBackgroundImage3() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full">
      <div className="h-[14.715px] relative shrink-0 w-[15.335px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.3345 14.7147">
          <g clipPath="url(#clip0_49_1157)" id="Icon">
            <path d={svgPaths.pc35ac80} fill="var(--fill-0, #F0B100)" id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
          <defs>
            <clipPath id="clip0_49_1157">
              <rect fill="white" height="14.7147" width="15.3345" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="relative shrink-0">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            {"4.8"}
          </p>
        </div>
      </div>
      <div className="relative shrink-0">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6a7282] text-[14px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            {"(156 avis)"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ContainerBackgroundImage2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.8px] pt-0 px-0 relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-center relative shrink-0 w-full">
        <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[32px] min-h-px min-w-px relative shrink-0 text-[#00a63e] text-[24px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {"XX.XX DZD"}
        </p>
      </div>
    </div>
  );
}
type ParagraphBackgroundImageAndText1Props = {
  text: string;
};

function ParagraphBackgroundImageAndText1({ text }: ParagraphBackgroundImageAndText1Props) {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type ParagraphBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ParagraphBackgroundImageAndText({ text, additionalClassNames = "" }: ParagraphBackgroundImageAndTextProps) {
  return (
    <div className={clsx("content-stretch flex relative shrink-0 w-full", additionalClassNames)}>
      <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#4a5565] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText({ text, additionalClassNames = "" }: BackgroundImageAndTextProps) {
  return (
    <div className={clsx("content-stretch flex relative shrink-0 w-full", additionalClassNames)}>
      <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[#101828] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}

function MynauiPercentageWavesBackgroundImage() {
  return (
    <div className="relative shrink-0 size-[13px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
        <g id="mynaui:percentage-waves">
          <path d={svgPaths.p2861c180} id="Vector" stroke="var(--stroke-0, #006045)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function ContainerBackgroundImage1() {
  return (
    <div className="bg-[#d0fae5] h-[23.988px] relative rounded-[2.68435e+07px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center pl-[8px] pr-0 py-0 relative size-full">
          <BackgroundImage1>
            <g clipPath="url(#clip0_49_405)" id="Icon">
              <path d={svgPaths.p1242ba00} id="Vector" stroke="var(--stroke-0, #006045)" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.5 5.5L6 7L11 2" id="Vector_2" stroke="var(--stroke-0, #006045)" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_49_405">
                <rect fill="white" height="12" width="12" />
              </clipPath>
            </defs>
          </BackgroundImage1>
          <TextBackgroundImageAndText text="Disponible" />
        </div>
      </div>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
};

function TextBackgroundImageAndText({ text }: TextBackgroundImageAndTextProps) {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[56.138px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#006045] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function ContainerBackgroundImage() {
  return (
    <BackgroundImage2 additionalClassNames="bg-[#f3f4f6] size-[48px]">
      <BackgroundImage>
        <path d={svgPaths.p3bfee9c0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M12 22V12" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M3.29 7L12 12L20.71 7" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M7.5 4.27L16.5 9.42" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </BackgroundImage>
    </BackgroundImage2>
  );
}

export default function ECommerceWebsiteUiUxDesign() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center pb-0 pt-[434px] px-[32px] relative size-full" data-name="E-commerce Website UI/UX Design">
      <div className="absolute bg-white content-stretch flex flex-col h-[82px] items-start left-px pb-0 pt-[16px] px-[16px] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[352px] w-[548px]" data-name="Container">
        <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="Container">
          <div className="basis-0 grow h-[49.6px] min-h-px min-w-px relative shrink-0" data-name="Container">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[15px] relative size-full">
                <div className="absolute h-[49.6px] left-0 rounded-[10px] top-0" data-name="Text Input">
                  <div className="content-stretch flex h-full items-center overflow-clip pl-[40px] pr-[16px] py-[12px] relative rounded-[inherit]">
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[rgba(16,24,40,0.5)] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Rechercher par nom ou référence...
                    </p>
                  </div>
                  <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
                </div>
                <IconBackgroundImage additionalClassNames="relative shrink-0">
                  <path d="M17.5 17.5L13.8833 13.8833" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d={svgPaths.pcddfd00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </IconBackgroundImage>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] h-[49.6px] items-center relative shrink-0" data-name="Container">
            <div className="h-[19.834px] relative shrink-0 w-[20px]" data-name="Icon">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19.8337">
                <g id="Icon">
                  <path d={svgPaths.p1d1e6cc0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </g>
              </svg>
            </div>
            <div className="h-[46px] relative rounded-[10px] shrink-0 w-[150px]" data-name="Dropdown">
              <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] pl-[-1049.2px] pr-[1234.8px] pt-[-325.587px] relative size-full">
                {[...Array(3).keys()].map((_, i) => (
                  <div className="h-0 shrink-0 w-full" data-name="Option" />
                ))}
                <div className="h-0 relative shrink-0 w-full" data-name="Option">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[1063px] text-[16px] text-[rgba(16,24,40,0.5)] text-nowrap top-[340px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Disponibilité
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-white content-stretch flex h-[160px] items-start left-0 pb-px pt-[80px] px-[31px] top-0 w-[549px]" data-name="LandingPage">
        <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none shadow-[0px_4px_23.4px_0px_rgba(0,0,0,0.21)]" />
        <div className="basis-0 content-stretch flex grow h-[51.987px] items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Container">
          <div className="h-[51.987px] relative shrink-0 w-[174.188px]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
              <BackgroundImage2 additionalClassNames="bg-[#0084d1] size-[40px]">
                <BackgroundImage>
                  <path d={svgPaths.p3bfee9c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M12 22V12" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M3.29 7L12 12L20.71 7" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M7.5 4.27L16.5 9.42" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </BackgroundImage>
              </BackgroundImage2>
              <BackgroundImage4 additionalClassNames="h-[51.987px] w-[122.188px]">
                <div className="absolute h-[31.988px] left-0 top-0 w-[122.188px]" data-name="Heading 1">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[32px] left-0 text-[#0069a8] text-[24px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    DawaDzLink
                  </p>
                </div>
                <div className="absolute h-[20px] left-0 top-[31.99px] w-[122.188px]" data-name="Paragraph">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Pharmacie Centrale
                  </p>
                </div>
              </BackgroundImage4>
            </div>
          </div>
          <BackgroundImage4 additionalClassNames="h-[40px] rounded-[10px] w-[152.438px]">
            <IconBackgroundImage additionalClassNames="absolute left-[16px] top-[10px]">
              <path d={svgPaths.p14ca9100} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              <path d="M17.5 10H7.5" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              <path d={svgPaths.p27a73396} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </IconBackgroundImage>
            <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[90.5px] text-[#364153] text-[16px] text-center text-nowrap top-[8.4px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Déconnexion
            </p>
          </BackgroundImage4>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col h-[192px] items-center left-0 pb-0 pt-[48px] px-[2.8px] top-[160px] w-[549px]" data-name="Container" style={{ backgroundImage: "linear-gradient(160.724deg, rgb(0, 132, 209) 0%, rgb(0, 105, 168) 100%)" }}>
        <div className="relative shrink-0 w-full" data-name="Container">
          <div className="flex flex-col items-center size-full">
            <div className="content-stretch flex flex-col gap-[16px] items-center px-[32px] py-0 relative w-full">
              <div className="content-stretch flex gap-[12px] h-[32px] items-center justify-center pl-0 pr-[0.012px] py-0 relative shrink-0 w-[1216px]" data-name="Container">
                <div className="relative shrink-0 size-[32px]" data-name="Icon">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <g id="Icon">
                      <path d="M28 28L22.2133 22.2133" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                      <path d={svgPaths.p27fd0e80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                    </g>
                  </svg>
                </div>
                <BackgroundImage4 additionalClassNames="h-[28px] w-[233.188px]">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-[117px] text-[20px] text-center text-nowrap text-white top-[-0.6px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Trouvez vos médicaments
                  </p>
                </BackgroundImage4>
              </div>
              <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Paragraph">
                <p className="basis-0 font-['Roboto:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[#dff2fe] text-[16px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Recherchez parmi des milliers de produits pharmaceutiques et contactez directement les agents commerciaux
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#f9fafb] content-stretch flex flex-col items-center px-0 py-[32px] relative shrink-0 w-full" data-name="PharmacyDashboard">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="ProductSearch">
          <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Paragraph">
            <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#4a5565] text-[16px] w-[129px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              5 produits trouvés
            </p>
          </div>
          <div className="content-start flex flex-wrap gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
            <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-[216px]" data-name="Container">
              <div className="bg-[#00c950] h-[8px] relative shrink-0 w-full" data-name="Container">
                <div className="size-full" />
              </div>
              <ContainerBackgroundImage5>
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
                  <ContainerBackgroundImage />
                  <BackgroundImage3>
                    <ContainerBackgroundImage1 />
                    <div className="bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center pl-[8px] pr-0 py-0 relative rounded-[2.68435e+07px] shrink-0 w-[88.138px]" data-name="Container">
                      <MynauiPercentageWavesBackgroundImage />
                      <TextBackgroundImageAndText text="UG 30%" />
                    </div>
                  </BackgroundImage3>
                </div>
                <BackgroundImageAndText text="Paracétamol 500mg" additionalClassNames="items-start" />
                <ParagraphBackgroundImageAndText text="MED-001" additionalClassNames="items-start" />
                <ParagraphBackgroundImageAndText1 text="Antalgique" />
                <ContainerBackgroundImage2 />
                <ContainerBackgroundImage4 />
                <ButtonBackgroundImage />
              </ContainerBackgroundImage5>
            </div>
            <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-[216px]" data-name="Container">
              <div className="bg-[#fb2c36] h-[8px] relative shrink-0 w-full" data-name="Container">
                <div className="size-full" />
              </div>
              <ContainerBackgroundImage5>
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
                  <ContainerBackgroundImage />
                  <div className="relative shrink-0">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-end relative">
                      <div className="bg-[#ffe2e2] content-stretch flex gap-[4px] h-[23.988px] items-center px-[8px] py-0 relative rounded-[2.68435e+07px] shrink-0 w-[96.925px]" data-name="Container">
                        <BackgroundImage1>
                          <g clipPath="url(#clip0_49_390)" id="Icon">
                            <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.5 4.5L4.5 7.5" id="Vector_2" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.5 4.5L7.5 7.5" id="Vector_3" stroke="var(--stroke-0, #9F0712)" strokeLinecap="round" strokeLinejoin="round" />
                          </g>
                          <defs>
                            <clipPath id="clip0_49_390">
                              <rect fill="white" height="12" width="12" />
                            </clipPath>
                          </defs>
                        </BackgroundImage1>
                        <div className="basis-0 grow h-[15.988px] min-h-px min-w-px relative shrink-0" data-name="Text">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
                            <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#9f0712] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                              Indisponible
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center pl-[8px] pr-0 py-0 relative rounded-[2.68435e+07px] shrink-0 w-[88.138px]" data-name="Container">
                        <MynauiPercentageWavesBackgroundImage />
                        <TextBackgroundImageAndText text="UG 30%" />
                      </div>
                    </div>
                  </div>
                </div>
                <BackgroundImageAndText text="Amoxicilline 1g" additionalClassNames="items-start" />
                <ParagraphBackgroundImageAndText text="MED-001" additionalClassNames="items-start" />
                <ParagraphBackgroundImageAndText1 text="Antalgique" />
                <ContainerBackgroundImage2 />
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
                  <ParagraphBackgroundImageAndText text="Fournisseur" additionalClassNames="items-center" />
                  <BackgroundImageAndText text="MediSupply Pro" additionalClassNames="items-center" />
                  <ContainerBackgroundImage3 />
                </div>
                <ButtonBackgroundImage />
              </ContainerBackgroundImage5>
            </div>
            <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-[216px]" data-name="Container">
              <div className="bg-[#00c950] h-[8px] relative shrink-0 w-full" data-name="Container">
                <div className="size-full" />
              </div>
              <ContainerBackgroundImage5>
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
                  <ContainerBackgroundImage />
                  <BackgroundImage3>
                    <ContainerBackgroundImage1 />
                    <div className="bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center pl-[8px] pr-0 py-0 relative rounded-[2.68435e+07px] shrink-0 w-[88.138px]" data-name="Container">
                      <MynauiPercentageWavesBackgroundImage />
                      <TextBackgroundImageAndText text="UG 30%" />
                    </div>
                  </BackgroundImage3>
                </div>
                <HeadingBackgroundImageAndText text="Doliprane 1000mg" />
                <ParagraphBackgroundImageAndText text="MED-001" additionalClassNames="items-start" />
                <ParagraphBackgroundImageAndText1 text="Antalgique" />
                <ContainerBackgroundImage2 />
                <ContainerBackgroundImage4 />
                <ButtonBackgroundImage />
              </ContainerBackgroundImage5>
            </div>
            <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-[216px]" data-name="Container">
              <div className="bg-[#00c950] h-[8px] relative shrink-0 w-full" data-name="Container">
                <div className="size-full" />
              </div>
              <ContainerBackgroundImage5>
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
                  <ContainerBackgroundImage />
                  <BackgroundImage3>
                    <ContainerBackgroundImage1 />
                    <div className="bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center pl-[8px] pr-0 py-0 relative rounded-[2.68435e+07px] shrink-0 w-[88.138px]" data-name="Container">
                      <MynauiPercentageWavesBackgroundImage />
                      <TextBackgroundImageAndText text="UG 30%" />
                    </div>
                  </BackgroundImage3>
                </div>
                <HeadingBackgroundImageAndText text="Aspirine 100mg" />
                <ParagraphBackgroundImageAndText text="MED-001" additionalClassNames="items-start" />
                <ParagraphBackgroundImageAndText1 text="Antalgique" />
                <ContainerBackgroundImage2 />
                <ContainerBackgroundImage4 />
                <ButtonBackgroundImage />
              </ContainerBackgroundImage5>
            </div>
            <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 w-[216px]" data-name="Container">
              <div className="bg-[#00c950] h-[8px] relative shrink-0 w-full" data-name="Container">
                <div className="size-full" />
              </div>
              <ContainerBackgroundImage5>
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
                  <ContainerBackgroundImage />
                  <BackgroundImage3>
                    <ContainerBackgroundImage1 />
                    <div className="bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center pl-[8px] pr-0 py-0 relative rounded-[2.68435e+07px] shrink-0 w-[88.138px]" data-name="Container">
                      <MynauiPercentageWavesBackgroundImage />
                      <TextBackgroundImageAndText text="UG 30%" />
                    </div>
                  </BackgroundImage3>
                </div>
                <HeadingBackgroundImageAndText text="Ibuprofène 400mg" />
                <ParagraphBackgroundImageAndText text="MED-001" additionalClassNames="items-start" />
                <ParagraphBackgroundImageAndText1 text="Antalgique" />
                <ContainerBackgroundImage2 />
                <ContainerBackgroundImage4 />
                <ButtonBackgroundImage />
              </ContainerBackgroundImage5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}