"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Check, ChevronsUpDown, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitLead } from "@/lib/store/slices/leadSlice";
import { Badge } from "@/components/ui/badge";

const LeadGenerationForm = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.lead);
  const [open, setOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    contactNumber: "",
    email: "",
    sector: "",
    needsDescription: "",
    joinKingMansa: "yes",
  });
  const allInterests = ["Exportation", "Importation", "Les deux", "Autres"];

  const handleSelect = (value) => {
    const updatedInterests = selectedInterests.includes(value)
      ? selectedInterests.filter((item) => item !== value)
      : [...selectedInterests, value];
    setSelectedInterests(updatedInterests);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("Please log in to submit the form");
      return;
    }

    const data = {
      ...formData,
      interests: selectedInterests,
    };

    try {
      await dispatch(submitLead(data)).unwrap();
      toast.success("Form submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        organization: "",
        contactNumber: "",
        email: "",
        sector: "",
        needsDescription: "",
        joinKingMansa: "yes",
      });
      setSelectedInterests([]);
    } catch (err) {
      console.error("Submission error:", err); // Log error for debugging
      toast.error(err.message || "Failed to submit form");
    }
  };

  return (
    <div className="grid grid-cols-3 items-center gap-6 mt-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 col-span-2 p-6 bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)]"
      >
        <div className="w-full text-start">
          <h3 className="text-lg md:text-2xl font-bold text-[#1A3C5A] mb-2">
            Formulaire de Participation :
          </h3>
          <p className="md:text-[18px]">
            Faites-nous part de vos besoins commerciaux
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                placeholder="Votre Nom"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organisation / Entreprise</Label>
            <Input
              id="organization"
              placeholder="Nom de votre entreprise"
              value={formData.organization}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">
              Numéro de contact (WhatsApp de préférence)
            </Label>
            <Input
              id="contactNumber"
              type="tel"
              placeholder="Votre numéro WhatsApp"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Secteur d'activité</Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, sector: value }))
              }
              value={formData.sector}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir dans la liste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="mining">Mines</SelectItem>
                <SelectItem value="manufacturing">Manufacture</SelectItem>
                <SelectItem value="technology">Technologie</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Intérêts commerciaux avec la Malaisie</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedInterests.length > 0
                    ? `${selectedInterests.length} selected`
                    : "Select interests..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search interests..." />
                  <CommandEmpty>No interest found.</CommandEmpty>
                  <CommandGroup>
                    {allInterests.map((interest) => (
                      <CommandItem
                        key={interest}
                        value={interest}
                        onSelect={() => handleSelect(interest)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedInterests.includes(interest)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {interest}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleSelect(interest)}
                      className="ml-1 rounded-full outline-none hover:bg-accent"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="needsDescription">
              Décrivez vos besoins commerciaux ou les produits recherchés :
            </Label>
            <Textarea
              id="needsDescription"
              placeholder="Par exemple : Je cherche à importer des équipements agricoles de Malaisie, etc."
              rows={4}
              value={formData.needsDescription}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <Label className="block mb-4">
            Souhaitez-vous rejoindre la plateforme B2B KingMansa ?
          </Label>
          <RadioGroup
            value={formData.joinKingMansa}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, joinKingMansa: value }))
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">Non</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="px-8 py-6 text-lg"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
      <div className="col-span-1">
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <QrCode className="w-32 h-32 text-gray-800" />
          </div>
          <p className="text-[20px] font-bold max-w-[60%] text-center mb-6">
            Scannez ce code pour accéder à ce formulaire sur votre téléphone
            mobile
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadGenerationForm;
