import svgPaths from "./svg-17grt25g78";
import clsx from "clsx";
type ContainerBackgroundImageProps = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImageProps>) {
  return (
    <div className={clsx("h-[32px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
};

function BackgroundImageAndText({ text }: BackgroundImageAndTextProps) {
  return (
    <div className="h-[50px] relative rounded-[10px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[rgba(16,24,40,0.5)] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            {text}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}
type LabelBackgroundImageAndTextProps = {
  text: string;
};

function LabelBackgroundImageAndText({ text }: LabelBackgroundImageAndTextProps) {
  return (
    <div className="h-[24px] relative shrink-0 w-full">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#364153] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
};

function TextBackgroundImageAndText({ text }: TextBackgroundImageAndTextProps) {
  return (
    <BackgroundImage>
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#99a1af] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </BackgroundImage>
  );
}
type ContainerBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ContainerBackgroundImageAndText({ text, additionalClassNames = "" }: ContainerBackgroundImageAndTextProps) {
  return (
    <div className={clsx("relative rounded-[3.35544e+07px] shrink-0 size-[32px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function Container() {
  return <div className="bg-[#d1d5dc] h-[2px] shrink-0 w-[24px]" data-name="Container" />;
}

export default function InscriptionPharmacie() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center pb-[32px] pt-[192px] px-0 relative size-full" data-name="Inscription Pharmacie 3">
      <div className="bg-[rgba(249,250,251,0)] relative shrink-0 w-full" data-name="RegistrationFlow">
        <div className="content-stretch flex flex-col gap-[32px] items-start px-[32px] py-0 relative w-full">
          <button className="block cursor-pointer h-[24px] relative shrink-0 w-[74.797px]" data-name="Button">
            <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g id="Icon">
                  <path d={svgPaths.p33f6b680} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d="M15.8333 10H4.16667" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </g>
              </svg>
            </div>
            <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[51.5px] text-[#4a5565] text-[16px] text-center text-nowrap top-0 translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Retour
            </p>
          </button>
          <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex gap-[8px] items-center justify-center px-[17px] py-0 relative size-full">
                <ContainerBackgroundImage additionalClassNames="w-[131.375px]">
                  <ContainerBackgroundImageAndText text="1" additionalClassNames="bg-[#009689]" />
                  <BackgroundImage>
                    <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#00786f] text-[16px] text-nowrap top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Informations
                    </p>
                  </BackgroundImage>
                </ContainerBackgroundImage>
                <Container />
                <ContainerBackgroundImage additionalClassNames="w-[121.672px]">
                  <ContainerBackgroundImageAndText text="2" additionalClassNames="bg-[#d1d5dc]" />
                  <TextBackgroundImageAndText text="Documents" />
                </ContainerBackgroundImage>
                <Container />
                <ContainerBackgroundImage additionalClassNames="w-[120.672px]">
                  <ContainerBackgroundImageAndText text="3" additionalClassNames="bg-[#d1d5dc]" />
                  <TextBackgroundImageAndText text="Vérification" />
                </ContainerBackgroundImage>
              </div>
            </div>
          </div>
          <div className="bg-white h-[855px] relative rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
            <div className="content-stretch flex flex-col gap-[24px] items-start pb-0 pt-[32px] px-[32px] relative size-full">
              <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
                <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[28px] left-0 text-[#101828] text-[20px] top-[-1px] w-[195px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Inscription Pharmacie
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[24px] h-[739px] items-start relative shrink-0 w-full" data-name="Form">
                <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Nom de la pharmacie" />
                  <BackgroundImageAndText text="Pharmacie Centrale" />
                </div>
                <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Numéro de licence" />
                  <BackgroundImageAndText text="PH789012" />
                </div>
                <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Email" />
                  <BackgroundImageAndText text="contact@exemple.com" />
                </div>
                <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Téléphone" />
                  <BackgroundImageAndText text="+213 XXX XXX XXX" />
                </div>
                <div className="content-stretch flex flex-col gap-[8px] h-[137px] items-start relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Adresse" />
                  <div className="h-[98px] relative rounded-[10px] shrink-0 w-full" data-name="Text Area">
                    <div className="overflow-clip rounded-[inherit] size-full">
                      <div className="content-stretch flex items-start px-[16px] py-[12px] relative size-full">
                        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-[rgba(16,24,40,0.5)] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Adresse complète
                        </p>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="Container">
                  <LabelBackgroundImageAndText text="Mot de passe" />
                  <BackgroundImageAndText text="••••••••" />
                </div>
                <div className="bg-[#009689] relative rounded-[10px] shrink-0 w-full" data-name="Button">
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex items-center justify-center px-[50px] py-[12px] relative w-full">
                      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Continuer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 h-[1199px] left-0 pointer-events-none top-0">
        <div className="bg-white content-stretch flex h-[160px] items-start pb-px pointer-events-auto pt-[80px] px-[31px] sticky top-0 w-[549px]" data-name="LandingPage">
          <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none shadow-[0px_4px_23.4px_0px_rgba(0,0,0,0.21)]" />
          <div className="basis-0 content-stretch flex grow h-[48px] items-center justify-between min-h-px min-w-px relative shrink-0" data-name="Container">
            <div className="h-[48px] relative shrink-0 w-[166.422px]" data-name="Container">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
                <div className="relative rounded-[16.4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[44px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 187, 167) 0%, rgb(0, 150, 137) 100%)" }}>
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                    <div className="relative shrink-0 size-[24px]" data-name="Icon">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="Icon">
                          <path d={svgPaths.p3bfee9c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M12 22V12" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M3.29 7L12 12L20.71 7" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          <path d="M7.5 4.27L16.5 9.42" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Container">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
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
                  </div>
                </div>
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
    </div>
  );
}