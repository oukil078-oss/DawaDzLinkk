import svgPaths from "./svg-m7ihbzjhyu";
import clsx from "clsx";

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[32px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-full">{children}</div>
    </div>
  );
}

function Button1() {
  return (
    <Wrapper>
      <div className="h-[16px] overflow-clip relative shrink-0 w-full">
        <Vector additionalClassNames="inset-[45.83%_58.33%_29.17%_41.67%]" />
        <Vector additionalClassNames="inset-[45.83%_41.67%_29.17%_58.33%]" />
        <div className="absolute bottom-[8.33%] left-[20.83%] right-[20.83%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-6.25%_-7.14%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 12">
              <path d={svgPaths.p3f1e40} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-3/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-0.67px_-5.56%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 1.33333">
              <path d="M0.666667 0.666667H12.6667" id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
          <div className="absolute inset-[-25%_-12.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 4">
              <path d={svgPaths.p3a97aa70} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
type VectorProps = {
  additionalClassNames?: string;
};

function Vector({ additionalClassNames = "" }: VectorProps) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <div className="absolute inset-[-16.67%_-0.67px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 5.33333">
          <path d="M0.666667 0.666667V4.66667" id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </svg>
      </div>
    </div>
  );
}

function Button() {
  return (
    <Wrapper>
      <div className="h-[16px] overflow-clip relative shrink-0 w-full">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-5.56%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
              <path d={svgPaths.p73e95c0} id="Vector" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[8.35%_8.35%_33.32%_33.32%]" data-name="Vector">
          <div className="absolute inset-[-7.14%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6669 10.6669">
              <path d={svgPaths.p47c19f0} id="Vector" stroke="var(--stroke-0, #009689)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
type ButtonTextProps = {
  text: string;
};

function ButtonText({ text }: ButtonTextProps) {
  return (
    <div className="absolute bg-[#d0fae5] h-[28px] left-[24px] rounded-[2.68435e+07px] top-[18.4px] w-[89.5px]">
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[45px] text-[#006045] text-[14px] text-center text-nowrap top-[3.6px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type TableCellText1Props = {
  text: string;
  additionalClassNames?: string;
};

function TableCellText1({ text, additionalClassNames = "" }: TableCellText1Props) {
  return (
    <div className={clsx("absolute left-[616.98px] top-0 w-[153.175px]", additionalClassNames)}>
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[24px] text-[#101828] text-[16px] top-[20.8px] w-[75px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type TableCellTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TableCellText({ text, additionalClassNames = "" }: TableCellTextProps) {
  return (
    <div className={clsx("absolute top-0", additionalClassNames)}>
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[24px] left-[24px] text-[#101828] text-[16px] text-nowrap top-[20.8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type HeaderCellTextProps = {
  text: string;
  additionalClassNames?: string;
};

function HeaderCellText({ text, additionalClassNames = "" }: HeaderCellTextProps) {
  return (
    <div className={clsx("absolute h-[48.4px] top-0", additionalClassNames)}>
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[24px] left-[24px] text-[#364153] text-[16px] text-nowrap top-[12.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] size-full" data-name="Container">
      <div className="h-[242.4px] overflow-clip relative shrink-0 w-[1529px]" data-name="Table">
        <div className="absolute bg-[#f9fafb] border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[48.4px] left-0 top-0 w-[1216px]" data-name="Table Header">
          <div className="absolute h-[48.4px] left-0 top-0 w-[1216px]" data-name="Table Row">
            <HeaderCellText text="Référence" additionalClassNames="left-0 w-[151.688px]" />
            <HeaderCellText text="Nom du produit" additionalClassNames="left-[151.69px] w-[240.375px]" />
            <HeaderCellText text="DCI" additionalClassNames="left-[392.06px] w-[224.913px]" />
            <HeaderCellText text="Prix (DZD)" additionalClassNames="left-[616.98px] w-[153.175px]" />
            <div className="absolute h-[48.4px] left-[770.15px] top-0 w-[111.2px]" data-name="Header Cell">
              <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[24px] left-[13.35px] text-[#364153] text-[16px] text-nowrap top-[12.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                UG (%)
              </p>
            </div>
            <HeaderCellText text="Statut" additionalClassNames="left-[881.35px] w-[184.637px]" />
            <HeaderCellText text="Actions" additionalClassNames="left-[1065.99px] w-[150.012px]" />
          </div>
        </div>
        <div className="absolute h-[194px] left-0 top-[48.4px] w-[1216px]" data-name="Table Body">
          <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[64.8px] left-0 top-0 w-[1216px]" data-name="Table Row">
            <TableCellText text="MED-001" additionalClassNames="h-[64.8px] left-0 w-[151.688px]" />
            <TableCellText text="Doliprane 500mg" additionalClassNames="h-[64.8px] left-[151.69px] w-[240.375px]" />
            <TableCellText text="Paracétamol" additionalClassNames="h-[64.8px] left-[392.06px] w-[224.913px]" />
            <TableCellText1 text="25.50 DZD" additionalClassNames="h-[64.8px]" />
            <TableCellText text="10" additionalClassNames="h-[64.8px] left-[770.15px] w-[111.2px]" />
            <div className="absolute h-[64.8px] left-[881.35px] top-0 w-[184.637px]" data-name="Table Cell">
              <ButtonText text="Disponible" />
            </div>
            <div className="absolute h-[64.8px] left-[1065.99px] top-0 w-[150.012px]" data-name="Table Cell">
              <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center left-[24px] top-[16.4px] w-[102.013px]" data-name="Container">
                <Button />
                <Button1 />
              </div>
            </div>
          </div>
          <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[64.8px] left-0 top-[64.8px] w-[1216px]" data-name="Table Row">
            <TableCellText text="MED-002" additionalClassNames="h-[64.8px] left-0 w-[151.688px]" />
            <TableCellText text="Clamoxyl1g" additionalClassNames="h-[64.8px] left-[151.69px] w-[240.375px]" />
            <TableCellText text="Amoxicilline" additionalClassNames="h-[64.8px] left-[392.06px] w-[224.913px]" />
            <TableCellText1 text="85.00 DZD" additionalClassNames="h-[64.8px]" />
            <TableCellText text="15" additionalClassNames="h-[64.8px] left-[770.15px] w-[111.2px]" />
            <div className="absolute h-[64.8px] left-[881.35px] top-0 w-[184.637px]" data-name="Table Cell">
              <div className="absolute bg-[#ffe2e2] h-[28px] left-[24px] rounded-[2.68435e+07px] top-[18.4px] w-[99.738px]" data-name="Button">
                <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[20px] left-[50px] text-[#9f0712] text-[14px] text-center text-nowrap top-[3.6px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Indisponible
                </p>
              </div>
            </div>
            <div className="absolute h-[64.8px] left-[1065.99px] top-0 w-[150.012px]" data-name="Table Cell">
              <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center left-[24px] top-[16.4px] w-[102.013px]" data-name="Container">
                <Button />
                <Button1 />
              </div>
            </div>
          </div>
          <div className="absolute h-[64.4px] left-0 top-[129.6px] w-[1216px]" data-name="Table Row">
            <TableCellText text="MED-003" additionalClassNames="h-[64.4px] left-0 w-[151.688px]" />
            <TableCellText text="Antalfene 400mg" additionalClassNames="h-[64.4px] left-[151.69px] w-[240.375px]" />
            <TableCellText text="Ibuprofène" additionalClassNames="h-[64.4px] left-[392.06px] w-[224.913px]" />
            <TableCellText1 text="35.00 DZD" additionalClassNames="h-[64.4px]" />
            <TableCellText text="0" additionalClassNames="h-[64.4px] left-[770.15px] w-[111.2px]" />
            <div className="absolute h-[64.4px] left-[881.35px] top-0 w-[184.637px]" data-name="Table Cell">
              <ButtonText text="Disponible" />
            </div>
            <div className="absolute h-[64.4px] left-[1065.99px] top-0 w-[150.012px]" data-name="Table Cell">
              <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center left-[24px] top-[16.4px] w-[102.013px]" data-name="Container">
                <Button />
                <Button1 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}