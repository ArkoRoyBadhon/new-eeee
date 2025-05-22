"use client";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryApi } from "@/lib/api";

const FilterOptions = ({
  activeCategory,
  setActiveCategory,
  filters,
  setFilters,
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    delivery: false,
    merge: false,
    reviews: false,
    features: false,
    categories: false,
    price: false,
    order: false,
    country: false,
  });
  const [allCategory, setAllCategory] = useState([]);
  const [priceRange, setPriceRange] = useState({
    minPrice: null,
    maxPrice: null,
  });
  const [minOrder, setMinOrder] = useState(null);
  const [searchCountry, setSearchCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceFilter = () => {
    setFilters({
      ...filters,
      minPrice: priceRange.minPrice || null,
      maxPrice: priceRange.maxPrice || null,
    });
  };

  const handleMinOrderFilter = () => {
    setFilters({
      ...filters,
      minOrder: minOrder || null,
    });
  };

  useEffect(() => {
    (async () => {
      const response = await categoryApi.getCategories();
      setAllCategory(response);
    })();
  }, []);

  const countryData = [
    { label: "Bangladesh", value: "Bangladesh" },
    { label: "Nigeria", value: "Nigeria" },
    { label: "Uganda", value: "Uganda" },
  ];

  const handleCheckboxChange = (e) => {
    console.log("Checkbox changed", e.target.value);
    // setSelectedCountry(country);
  };

  const filteredCountry = countryData
    .filter((country) =>
      country?.label.toLowerCase().includes(searchCountry?.toLowerCase())
    )
    .slice(0, 4);

  return (
    <>
      {/* Mobile filter button (only shown on small screens) */}
      <div className="md:hidden flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-lg">Filters</h2>
        <Button
          variant="outline"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center gap-2"
        >
          {isMobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          {isMobileFiltersOpen ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </Button>
      </div>

      {/* Filter panel - responsive layout */}
      <div
        className={`
        md:w-[258px] p-4 md:p-6 rounded-lg custom-shadow border bg-white
        ${isMobileFiltersOpen ? "block" : "hidden md:block"}
      `}
      >
        <h2 className="font-bold text-xl text-[#222222] hidden lg:block mb-6">
          Filters
        </h2>

        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection("delivery")}
            >
              <h3 className="font-bold text-[14px] text-[#222222]">
                Delivery By
              </h3>
              <ChevronDown
                size={16}
                className={`md:hidden transition-transform ${
                  expandedSections.delivery ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`${
                expandedSections.delivery ? "block" : "hidden"
              } md:block`}
            >
              <p className="text-xs text-gray-500 mb-3">
                Unit price is subject to expected delivery date
              </p>
              <RadioGroup className="flex flex-col gap-[8px] text-[#222222]">
                <div className="flex items-center gap-[8px]">
                  <RadioGroupItem value="7days" id="delivery-1" />
                  <Label htmlFor="delivery-1">Delivery by 50 days</Label>
                </div>
                <div className="flex items-center gap-[8px]">
                  <RadioGroupItem value="15days" id="delivery-2" />
                  <Label htmlFor="delivery-2">Delivery by 60 days</Label>
                </div>
                <div className="flex items-center gap-[8px]">
                  <RadioGroupItem value="30days" id="delivery-3" />
                  <Label htmlFor="delivery-3">Delivery by 90 days</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Merge results */}
          <div className="space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection("merge")}
            >
              <h3 className="font-bold text-[14px] text-[#222222]">
                Merge results
              </h3>
              <ChevronDown
                size={16}
                className={`md:hidden transition-transform ${
                  expandedSections.merge ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`${
                expandedSections.merge ? "block" : "hidden"
              } md:block`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Checkbox
                  id="merge"
                  className="data-[state=checked]:bg-[#dfb547] data-[state=checked]:border-[#dfb547]"
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      merge: checked,
                    })
                  }
                />
                <Label htmlFor="merge" className="text-[#222222]">
                  Merge by supplier
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Only the most relevant item from each supplier will be shown
              </p>
            </div>
          </div>

          {/* Store Reviews */}
          <div className="flex flex-col gap-[8px]">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection("reviews")}
            >
              <h3 className="font-bold text-[14px] text-[#222222]">
                Store Reviews
              </h3>
              <ChevronDown
                size={16}
                className={`md:hidden transition-transform ${
                  expandedSections.reviews ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`${
                expandedSections.reviews ? "block" : "hidden"
              } md:block`}
            >
              <p className="text-xs text-[#222222] mb-3">
                Based on a %-star rating system
              </p>
              <RadioGroup
                onValueChange={(value) =>
                  setFilters({ ...filters, rating: value })
                }
                className="flex flex-col gap-[8px] text-[#222222]"
              >
                <div className="flex items-center gap-[8px]">
                  <RadioGroupItem value="3" id="review-1" />
                  <Label htmlFor="review-1">3.0 & up</Label>
                </div>
                <div className="flex items-center gap-[8px]">
                  <RadioGroupItem value="4" id="review-2" />
                  <Label htmlFor="review-2">4.0 & up</Label>
                </div>
                <div className="flex items-center gap-[8px]">
                  <RadioGroupItem value="5" id="review-3" />
                  <Label htmlFor="review-3">5.0</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Product features */}
          <div className="space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection("features")}
            >
              <h3 className="font-bold text-[14px] text-[#222222]">
                Product features
              </h3>
              <ChevronDown
                size={16}
                className={`md:hidden transition-transform ${
                  expandedSections.features ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`${
                expandedSections.features ? "block" : "hidden"
              } md:block`}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id="product-feature"
                  className="data-[state=checked]:bg-[#dfb547] data-[state=checked]:border-[#dfb547]"
                  onCheckedChange={(checked) =>
                    setFilters({
                      ...filters,
                      paidSample: checked ? true : false,
                    })
                  }
                />
                <Label htmlFor="product-feature">Paid samples</Label>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection("categories")}
            >
              <h3 className="font-bold text-[14px] text-[#222222]">
                Categories
              </h3>
              <ChevronDown
                size={16}
                className={`md:hidden transition-transform ${
                  expandedSections.categories ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`${
                expandedSections.categories ? "block" : "hidden"
              } md:block`}
            >
              <ul className="flex flex-col gap-2 text-sm w-full">
                {["All", ...allCategory]?.map((category, index) => (
                  <li key={index}>
                    <button
                      className={`cursor-pointer px-4 py-2 rounded-md w-full transition-colors ${
                        activeCategory ===
                        (category === "All" ? null : category._id)
                          ? "bg-[#dfb547] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setActiveCategory(
                          category === "All" ? null : category._id
                        )
                      }
                    >
                      {category === "All" ? "All" : category?.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection("price")}
            >
              <h3 className="font-bold text-[14px] text-[#222222]">Price</h3>
              <ChevronDown
                size={16}
                className={`md:hidden transition-transform ${
                  expandedSections.price ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`${
                expandedSections.price ? "block" : "hidden"
              } md:block`}
            >
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="min"
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, minPrice: e.target.value })
                  }
                  className="p-1 flex-1"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="max"
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, maxPrice: e.target.value })
                  }
                  className="p-1 flex-1"
                />
                <Button
                  onClick={handlePriceFilter}
                  variant="outline"
                  className="rounded-full hover:bg-[#dfb547] hover:text-white px-4 py-1"
                >
                  Ok
                </Button>
              </div>
            </div>
          </div>

          {/* Min. order */}
          <div className="space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection("order")}
            >
              <h3 className="font-bold text-[14px] text-[#222222]">
                Min. order
              </h3>
              <ChevronDown
                size={16}
                className={`md:hidden transition-transform ${
                  expandedSections.order ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`${
                expandedSections.order ? "block" : "hidden"
              } md:block`}
            >
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  onChange={(e) => setMinOrder(e.target.value)}
                  placeholder="min. order"
                  className="p-1 flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleMinOrderFilter}
                  className="rounded-full hover:bg-[#dfb547] hover:text-white px-4 py-1"
                >
                  Ok
                </Button>
              </div>
            </div>
          </div>

          {/* Supplier country/region */}
          <div className="space-y-2">
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-auto"
              onClick={() => toggleSection("country")}
            >
              <h3 className="font-bold text-[14px] text-[#222222]">
                Supplier country/region
              </h3>
              <ChevronDown
                size={16}
                className={`md:hidden transition-transform ${
                  expandedSections.country ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`${
                expandedSections.country ? "block" : "hidden"
              } md:block`}
            >
              <div className="">
                <Input
                  type="text"
                  onChange={(e) => setSearchCountry(e.target.value)}
                  placeholder="country/region"
                  className="py-1 px-3 flex-1"
                />
              </div>
              <div className="mt-4">
                <RadioGroup
                  value={selectedCountry}
                  onValueChange={(value) => {
                    setSelectedCountry(value);
                    setFilters({ ...filters, country: value });
                  }}
                >
                  {(filteredCountry.length > 0
                    ? filteredCountry
                    : countryData
                  ).map((country) => (
                    <div
                      key={country.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={country.value}
                        id={country.value}
                        className=""
                      />
                      <Label htmlFor={country.value}>{country.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterOptions;
