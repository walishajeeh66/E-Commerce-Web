  // *********************
  // Role of the component: Single product tabs on the single product page containing product description, main product info and reviews
  // Name of the component: ProductTabs.tsx
  // Developer: Wali E-commerce Team
  // Version: 1.0
  // Component call: <ProductTabs product={product} />
  // Input parameters: { product: Product }
  // Output: Single product tabs containing product description, main product info and reviews
  // *********************

  "use client";

  import React, { useMemo, useState } from "react";
  import RatingPercentElement from "./RatingPercentElement";
  import SingleReview from "./SingleReview";
  import { formatCategoryName } from "@/utils/categoryFormating";
  import { sanitize, sanitizeHtml } from "@/lib/sanitize";

  const transformDescription = (raw?: string): string => {
    if (!raw) return "";
    let html = String(raw).replace(/\r\n|\r/g, "\n");
    // Headings
    html = html.replace(/<h1>([\s\S]*?)<\/h1>/gi, (_m, g1) => {
      return `<h2 class="text-3xl font-bold text-[var(--brand-blue,#1E396E)] mb-4">${g1}</h2>`;
    });
    // Note: Only tag-based transformations are applied (no hardcoded headings)
    // Bold
    html = html.replace(/<b>([\s\S]*?)<\/b>/gi, (_m, g1) => {
      return `<strong class="font-semibold text-black">${g1}</strong>`;
    });
    // Bullets -> li
    html = html.replace(/<bullet>([\s\S]*?)<\/bullet>/gi, (_m, g1) => {
      return `<li class="text-black leading-7">${g1}</li>`;
    });
    // Wrap standalone text lines into paragraphs
    const lines = html.split(/\n+/);
    const processed: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/^<\/?(ul|li|strong)[\s>]/i.test(trimmed)) {
        processed.push(trimmed);
        continue;
      }
      if (/^<h2[\s>]/i.test(trimmed) || /^<h3[\s>]/i.test(trimmed)) {
        processed.push(trimmed);
        continue;
      }
      processed.push(`<p class="text-black leading-7 mb-3">${trimmed}</p>`);
    }
    html = processed.join("\n");
    // Wrap consecutive <li>..</li> groups with a styled <ul>
    html = html.replace(/(?:\s*<li[^>]*>[\s\S]*?<\/li>\s*)+/gi, (match) => {
      return `<ul class="list-disc list-outside pl-6 space-y-2 marker:text-[var(--brand-blue,#1E396E)]">${match}</ul>`;
    });
    return html;
  };

  const ProductTabs = ({ product }: { product: Product }) => {
    const [currentProductTab, setCurrentProductTab] = useState<number>(0);
    const formattedDescription = useMemo(() => sanitizeHtml(transformDescription(product?.description)), [product?.description]);

    return (
      <div className="px-5 text-black">
        <div role="tablist" className="tabs tabs-bordered">
          <a
            role="tab"
            className={`tab text-lg text-black pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
              currentProductTab === 0 && "tab-active"
            }`}
            onClick={() => setCurrentProductTab(0)}
          >
            Description
          </a>
          <a
            role="tab"
            className={`tab text-black text-lg pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
              currentProductTab === 1 && "tab-active"
            }`}
            onClick={() => setCurrentProductTab(1)}
          >
            Additional info
          </a>
        </div>
        <div className="pt-5">
          {currentProductTab === 0 && (
            <div 
              className="max-w-none text-black text-base leading-7 space-y-2 max-sm:text-sm"
              dangerouslySetInnerHTML={{ __html: formattedDescription }}
            />
          )}

          {currentProductTab === 1 && (
            <div className="overflow-x-auto">
              <table className="table text-xl text-center max-[500px]:text-base">
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>Manufacturer:</th>
                    <td>{sanitize(product?.manufacturer)}</td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>Category:</th>
                    <td>
                      {product?.category?.name
                        ? sanitize(formatCategoryName(product?.category?.name))
                        : "No category"}
                    </td>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>Color:</th>
                    <td>Silver, LightSlateGray, Blue</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default ProductTabs;
