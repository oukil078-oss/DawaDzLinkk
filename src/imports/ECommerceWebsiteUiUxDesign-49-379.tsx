import svgPaths from "./svg-idmjnhrxw7";
import clsx from "clsx";
type BackgroundImage5Props = {
  additionalClassNames?: string;
};

function BackgroundImage5({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage5Props>) {
  return (
    <div className={clsx("relative rounded-[10px] shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">{children}</div>
    </div>
  );
}
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

function BackgroundImage3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        {children}
      </svg>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[#d0fae5] h-[23.988px] relative rounded-[2.68435e+07px] shrink-0 w-[88.138px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pl-[8px] pr-0 py-0 relative size-full">{children}</div>
    </div>
  );
}
type IconBackgroundImage2Props = {
  additionalClassNames?: string;
};

function IconBackgroundImage2({ children, additionalClassNames = "" }: React.PropsWithChildren<IconBackgroundImage2Props>) {
  return (
    <div className={clsx("size-[20px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function ContainerBackgroundImage2() {
  return (
    <BackgroundImage2>
      <BackgroundImage3>
        <g clipPath="url(#clip0_49_386)" id="Icon">
          <path d={svgPaths.p3ea2eb00} id="Vector" stroke="var(--stroke-0, #006045)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 5.5L6 7L11 2" id="Vector_2" stroke="var(--stroke-0, #006045)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_49_386">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </BackgroundImage3>
      <TextBackgroundImageAndText text="Disponible" />
    </BackgroundImage2>
  );
}
type ButtonBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ButtonBackgroundImageAndText({ text, additionalClassNames = "" }: ButtonBackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute bg-[#0084d1] h-[40px] left-[24px] rounded-[10px] top-[324.79px]", additionalClassNames)}>
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[171.14px] text-[16px] text-center text-nowrap text-white top-[8.4px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type TextBackgroundImageAndText1Props = {
  text: string;
};

function TextBackgroundImageAndText1({ text }: TextBackgroundImageAndText1Props) {
  return (
    <BackgroundImage4 additionalClassNames="h-[20px] w-[19.438px]">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#364153] text-[14px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </BackgroundImage4>
  );
}

function IconBackgroundImage1() {
  return (
    <BackgroundImage>
      <path d={svgPaths.p1cb7cc00} fill="var(--fill-0, #F0B100)" id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage>
  );
}
type ParagraphBackgroundImageAndText1Props = {
  text: string;
};

function ParagraphBackgroundImageAndText1({ text }: ParagraphBackgroundImageAndText1Props) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-[0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type ContainerBackgroundImage1Props = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage1({ additionalClassNames = "" }: ContainerBackgroundImage1Props) {
  return (
    <div className={clsx("absolute content-stretch flex flex-col h-[48.788px] items-start left-[24px] pb-[0.8px] pt-0 px-0 top-[168px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
      <div className="h-[31.988px] relative shrink-0 w-full">
        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[32px] left-0 text-[#00a63e] text-[24px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {"XX.XX DZD"}
        </p>
      </div>
    </div>
  );
}
type BackgroundImageAndText2Props = {
  text: string;
};

function BackgroundImageAndText2({ text }: BackgroundImageAndText2Props) {
  return (
    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#6a7282] text-[14px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type BackgroundImageAndText1Props = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText1({ text, additionalClassNames = "" }: BackgroundImageAndText1Props) {
  return (
    <div className={clsx("absolute h-[20px] left-[24px] top-[136px]", additionalClassNames)}>
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#6a7282] text-[14px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
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

function IconBackgroundImage() {
  return (
    <BackgroundImage3>
      <g clipPath="url(#clip0_49_405)" id="Icon">
        <path d={svgPaths.p1242ba00} id="Vector" stroke="var(--stroke-0, #006045)" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 5.5L6 7L11 2" id="Vector_2" stroke="var(--stroke-0, #006045)" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_49_405">
          <rect fill="white" height="12" width="12" />
        </clipPath>
      </defs>
    </BackgroundImage3>
  );
}

function ContainerBackgroundImage() {
  return (
    <BackgroundImage5 additionalClassNames="bg-[#f3f4f6] size-[48px]">
      <BackgroundImage1>
        <path d={svgPaths.p3bfee9c0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M12 22V12" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M3.29 7L12 12L20.71 7" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M7.5 4.27L16.5 9.42" id="Vector_4" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </BackgroundImage1>
    </BackgroundImage5>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
};

function BackgroundImageAndText({ text }: BackgroundImageAndTextProps) {
  return (
    <div className="h-[20px] relative shrink-0 w-full">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
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
    <div className={clsx("absolute h-[20px]", additionalClassNames)}>
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}

export default function ECommerceWebsiteUiUxDesign() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="E-commerce Website UI/UX Design">
      <div className="bg-[#f9fafb] content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-name="PharmacyDashboard">
        <div className="bg-white h-[83.988px] relative shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Header">
          <div className="content-stretch flex flex-col items-start pb-0 pt-[16px] px-[34.8px] relative size-full">
            <div className="content-stretch flex h-[51.987px] items-center justify-between relative shrink-0 w-full" data-name="Container">
              <div className="h-[51.987px] relative shrink-0 w-[174.188px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
                  <BackgroundImage5 additionalClassNames="bg-[#0084d1] size-[40px]">
                    <BackgroundImage1>
                      <path d={svgPaths.p3bfee9c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <path d="M12 22V12" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <path d="M3.29 7L12 12L20.71 7" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <path d="M7.5 4.27L16.5 9.42" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </BackgroundImage1>
                  </BackgroundImage5>
                  <BackgroundImage4 additionalClassNames="h-[51.987px] w-[122.188px]">
                    <div className="absolute h-[31.988px] left-0 top-0 w-[122.188px]" data-name="Heading 1">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[32px] left-0 text-[#0069a8] text-[24px] text-nowrap top-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        DawaDzLink
                      </p>
                    </div>
                    <ParagraphBackgroundImageAndText text="Pharmacie Centrale" additionalClassNames="left-0 top-[31.99px] w-[122.188px]" />
                  </BackgroundImage4>
                </div>
              </div>
              <BackgroundImage4 additionalClassNames="h-[40px] rounded-[10px] w-[152.438px]">
                <IconBackgroundImage2 additionalClassNames="absolute left-[16px] top-[10px]">
                  <path d={svgPaths.p14ca9100} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d="M17.5 10H7.5" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d={svgPaths.p27a73396} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </IconBackgroundImage2>
                <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[90.5px] text-[#364153] text-[16px] text-center text-nowrap top-[8.4px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Déconnexion
                </p>
              </BackgroundImage4>
            </div>
          </div>
        </div>
        <div className="h-[192px] relative shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(172.843deg, rgb(0, 132, 209) 0%, rgb(0, 105, 168) 100%)" }}>
          <div className="flex flex-col items-center size-full">
            <div className="content-stretch flex flex-col items-center pb-0 pt-[48px] px-[2.8px] relative size-full">
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
                    <div className="h-[48px] relative shrink-0 w-[672px]" data-name="Paragraph">
                      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[336.31px] text-[#dff2fe] text-[16px] text-center top-[0.4px] translate-x-[-50%] w-[632px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Recherchez parmi des milliers de produits pharmaceutiques et contactez directement les agents commerciaux
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] h-[963.175px] items-start relative shrink-0 w-[1216px]" data-name="ProductSearch">
          <div className="bg-white h-[81.6px] relative rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
            <div className="content-stretch flex flex-col items-start pb-0 pt-[16px] px-[16px] relative size-full">
              <div className="h-[49.6px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex gap-[8px] h-[49.6px] items-center left-[970.4px] top-0 w-[213.6px]" data-name="Container">
                  <IconBackgroundImage2 additionalClassNames="relative shrink-0">
                    <path d={svgPaths.p2133ea00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage2>
                  <div className="h-[46.4px] relative rounded-[10px] shrink-0 w-[185.6px]" data-name="Dropdown">
                    <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] pl-[-1049.2px] pr-[1234.8px] pt-[-325.587px] relative size-full">
                      {[...Array(3).keys()].map((_, i) => (
                        <div className="h-0 shrink-0 w-full" data-name="Option" />
                      ))}
                      <div className="h-0 relative shrink-0 w-full" data-name="Option">
                        <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[1063.1px] text-[16px] text-[rgba(16,24,40,0.5)] text-nowrap top-[340.21px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Nouveaux
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute h-[49.6px] left-0 top-0 w-[954.4px]" data-name="Container">
                  <div className="absolute h-[49.6px] left-0 rounded-[10px] top-0 w-[954.4px]" data-name="Text Input">
                    <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[12px] relative rounded-[inherit] size-full">
                      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[rgba(16,24,40,0.5)] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Rechercher par nom ou référence...
                      </p>
                    </div>
                    <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
                  </div>
                  <IconBackgroundImage2 additionalClassNames="absolute left-[12px] top-[14.8px]">
                    <path d="M17.5 17.5L13.8833 13.8833" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    <path d={svgPaths.pcddfd00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </IconBackgroundImage2>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
            <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] top-[0.4px] w-[129px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              5 produits trouvés
            </p>
          </div>
          <div className="h-[817.575px] relative shrink-0 w-full" data-name="Container">
            <div className="absolute bg-white content-stretch flex flex-col h-[396.788px] items-start left-0 overflow-clip rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[389.325px]" data-name="Container">
              <div className="bg-[#00c950] h-[8px] shrink-0 w-full" data-name="Container" />
              <div className="h-[388.788px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[24px] top-[24px] w-[341.325px]" data-name="Container">
                  <ContainerBackgroundImage />
                  <div className="relative shrink-0 w-[88.138px]">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
                      <div className="bg-[#d0fae5] h-[23.988px] relative rounded-[2.68435e+07px] shrink-0 w-full" data-name="Container">
                        <div className="flex flex-row items-center size-full">
                          <div className="content-stretch flex gap-[4px] items-center pl-[8px] pr-0 py-0 relative size-full">
                            <IconBackgroundImage />
                            <TextBackgroundImageAndText text="Disponible" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute content-stretch flex items-center justify-between left-[24px] top-[84px] w-[341.325px]" data-name="Heading 4">
                  <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#101828] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>{`Paracétamol 500mg `}</p>
                  <div className="bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center pl-[8px] pr-0 py-0 relative rounded-[2.68435e+07px] shrink-0 w-[88.138px]" data-name="Container">
                    <MynauiPercentageWavesBackgroundImage />
                    <TextBackgroundImageAndText text="UG 30%" />
                  </div>
                </div>
                <ParagraphBackgroundImageAndText text="MED-001" additionalClassNames="left-[24px] top-[112px] w-[341.325px]" />
                <BackgroundImageAndText1 text="Antalgique" additionalClassNames="w-[341.325px]" />
                <ContainerBackgroundImage1 additionalClassNames="w-[341.325px]" />
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[76px] items-start left-[24px] top-[232.79px] w-[341.325px]" data-name="Container">
                  <BackgroundImageAndText text="Fournisseur" />
                  <ParagraphBackgroundImageAndText1 text="Pharma Distribution SA" />
                  <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <TextBackgroundImageAndText1 text="4.8" />
                    <div className="h-[20px] relative shrink-0 w-[61.675px]" data-name="Text">
                      <BackgroundImageAndText2 text="(156 avis)" />
                    </div>
                  </div>
                </div>
                <ButtonBackgroundImageAndText text="Contacter le fournisseur" additionalClassNames="w-[341.325px]" />
              </div>
            </div>
            <div className="absolute bg-white content-stretch flex flex-col h-[396.788px] items-start left-[413.33px] overflow-clip rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[389.337px]" data-name="Container">
              <div className="bg-[#fb2c36] h-[8px] shrink-0 w-full" data-name="Container" />
              <div className="h-[332.788px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[24px] top-[24px] w-[341.337px]" data-name="Container">
                  <ContainerBackgroundImage />
                  <div className="bg-[#ffe2e2] h-[23.988px] relative rounded-[2.68435e+07px] shrink-0 w-[96.925px]" data-name="Container">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
                      <BackgroundImage3>
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
                      </BackgroundImage3>
                      <div className="basis-0 grow h-[15.988px] min-h-px min-w-px relative shrink-0" data-name="Text">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
                          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#9f0712] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Indisponible
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute h-[24px] left-[24px] top-[84px] w-[341.337px]" data-name="Heading 4">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-[0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Amoxicilline 1g
                  </p>
                  <div className="absolute bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center left-[252.86px] pl-[8px] pr-0 py-0 rounded-[2.68435e+07px] top-[0.01px] w-[88.138px]" data-name="Container">
                    <MynauiPercentageWavesBackgroundImage />
                    <TextBackgroundImageAndText text="UG 30%" />
                  </div>
                </div>
                <ParagraphBackgroundImageAndText text="MED-002" additionalClassNames="left-[24px] top-[112px] w-[341.337px]" />
                <BackgroundImageAndText1 text="Antibiotique" additionalClassNames="w-[341.337px]" />
                <ContainerBackgroundImage1 additionalClassNames="w-[341.337px]" />
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[76px] items-start left-[24px] top-[232.79px] w-[341.337px]" data-name="Container">
                  <BackgroundImageAndText text="Fournisseur" />
                  <ParagraphBackgroundImageAndText1 text="MediSupply Pro" />
                  <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <TextBackgroundImageAndText1 text="4.5" />
                    <div className="h-[20px] relative shrink-0 w-[61.675px]" data-name="Text">
                      <BackgroundImageAndText2 text="(156 avis)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bg-white content-stretch flex flex-col h-[396.788px] items-start left-[826.66px] overflow-clip rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-0 w-[389.325px]" data-name="Container">
              <div className="bg-[#00c950] h-[8px] shrink-0 w-full" data-name="Container" />
              <div className="h-[388.788px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[24px] top-[24px] w-[341.325px]" data-name="Container">
                  <ContainerBackgroundImage />
                  <ContainerBackgroundImage2 />
                </div>
                <div className="absolute h-[24px] left-[24px] top-[84px] w-[341.325px]" data-name="Heading 4">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-[0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Ibuprofène 400mg
                  </p>
                  <div className="absolute bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center left-[253.52px] pl-[8px] pr-0 py-0 rounded-[2.68435e+07px] top-[0.01px] w-[88.138px]" data-name="Container">
                    <MynauiPercentageWavesBackgroundImage />
                    <TextBackgroundImageAndText text="UG 30%" />
                  </div>
                </div>
                <ParagraphBackgroundImageAndText text="MED-003" additionalClassNames="left-[24px] top-[112px] w-[341.325px]" />
                <BackgroundImageAndText1 text="Anti-inflammatoire" additionalClassNames="w-[341.325px]" />
                <ContainerBackgroundImage1 additionalClassNames="w-[341.325px]" />
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[76px] items-start left-[24px] top-[232.79px] w-[341.325px]" data-name="Container">
                  <BackgroundImageAndText text="Fournisseur" />
                  <ParagraphBackgroundImageAndText1 text="Pharma Distribution SA" />
                  <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                    <BackgroundImage>
                      <path d={svgPaths.pb3a1300} fill="var(--fill-0, #F0B100)" id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </BackgroundImage>
                    <TextBackgroundImageAndText1 text="4.8" />
                    <div className="h-[20px] relative shrink-0 w-[61.675px]" data-name="Text">
                      <BackgroundImageAndText2 text="(156 avis)" />
                    </div>
                  </div>
                </div>
                <ButtonBackgroundImageAndText text="Contacter le fournisseur" additionalClassNames="w-[341.325px]" />
              </div>
            </div>
            <div className="absolute bg-white content-stretch flex flex-col h-[396.788px] items-start left-0 overflow-clip rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[420.79px] w-[389.325px]" data-name="Container">
              <div className="bg-[#00c950] h-[8px] shrink-0 w-full" data-name="Container" />
              <div className="h-[388.788px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[24px] top-[24px] w-[341.325px]" data-name="Container">
                  <ContainerBackgroundImage />
                  <BackgroundImage2>
                    <IconBackgroundImage />
                    <TextBackgroundImageAndText text="Disponible" />
                  </BackgroundImage2>
                </div>
                <div className="absolute h-[24px] left-[24px] top-[84px] w-[341.325px]" data-name="Heading 4">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-[0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Aspirine 100mg
                  </p>
                  <div className="absolute bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center left-[253.19px] pl-[8px] pr-0 py-0 rounded-[2.68435e+07px] top-[0.22px] w-[88.138px]" data-name="Container">
                    <MynauiPercentageWavesBackgroundImage />
                    <TextBackgroundImageAndText text="UG 30%" />
                  </div>
                </div>
                <ParagraphBackgroundImageAndText text="MED-010" additionalClassNames="left-[24px] top-[112px] w-[341.325px]" />
                <BackgroundImageAndText1 text="Antalgique" additionalClassNames="w-[341.325px]" />
                <ContainerBackgroundImage1 additionalClassNames="w-[341.325px]" />
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[76px] items-start left-[24px] top-[232.79px] w-[341.325px]" data-name="Container">
                  <BackgroundImageAndText text="Fournisseur" />
                  <ParagraphBackgroundImageAndText1 text="HealthCare Solutions" />
                  <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <TextBackgroundImageAndText1 text="4.6" />
                    <div className="h-[20px] relative shrink-0 w-[61.675px]" data-name="Text">
                      <BackgroundImageAndText2 text="(156 avis)" />
                    </div>
                  </div>
                </div>
                <ButtonBackgroundImageAndText text="Contacter le fournisseur" additionalClassNames="w-[341.325px]" />
              </div>
            </div>
            <div className="absolute bg-white content-stretch flex flex-col h-[396.788px] items-start left-[413.33px] overflow-clip rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] top-[420.79px] w-[389.337px]" data-name="Container">
              <div className="bg-[#00c950] h-[8px] shrink-0 w-full" data-name="Container" />
              <div className="h-[388.788px] relative shrink-0 w-full" data-name="Container">
                <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[24px] top-[24px] w-[341.337px]" data-name="Container">
                  <ContainerBackgroundImage />
                  <ContainerBackgroundImage2 />
                </div>
                <div className="absolute h-[24px] left-[24px] top-[84px] w-[341.337px]" data-name="Heading 4">
                  <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-[0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Doliprane 1000mg
                  </p>
                  <div className="absolute bg-[#e9e9e9] content-stretch flex gap-[4px] h-[23.988px] items-center left-[252.86px] pl-[8px] pr-0 py-0 rounded-[2.68435e+07px] top-[0.22px] w-[88.138px]" data-name="Container">
                    <MynauiPercentageWavesBackgroundImage />
                    <TextBackgroundImageAndText text="UG 30%" />
                  </div>
                </div>
                <ParagraphBackgroundImageAndText text="MED-011" additionalClassNames="left-[24px] top-[112px] w-[341.337px]" />
                <BackgroundImageAndText1 text="Antalgique" additionalClassNames="w-[341.337px]" />
                <ContainerBackgroundImage1 additionalClassNames="w-[341.337px]" />
                <div className="absolute content-stretch flex flex-col gap-[4px] h-[76px] items-start left-[24px] top-[232.79px] w-[341.337px]" data-name="Container">
                  <BackgroundImageAndText text="Fournisseur" />
                  <ParagraphBackgroundImageAndText1 text="Pharma Distribution SA" />
                  <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
                    <IconBackgroundImage1 />
                    <TextBackgroundImageAndText1 text="4.8" />
                    <div className="h-[20px] relative shrink-0 w-[61.675px]" data-name="Text">
                      <BackgroundImageAndText2 text="(156 avis)" />
                    </div>
                  </div>
                </div>
                <ButtonBackgroundImageAndText text="Contacter le fournisseur" additionalClassNames="w-[341.337px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}