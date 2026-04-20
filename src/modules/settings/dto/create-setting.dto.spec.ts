import { validate } from 'class-validator';
import { CreateSettingDto, DataType } from './create-setting.dto';

describe('CreateSettingDto', () => {
  it('accepts valid string value', async () => {
    const dto = new CreateSettingDto();
    dto.name = 'theme';
    dto.data_type = DataType.STRING;
    dto.value = 'dark';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('accepts valid number value', async () => {
    const dto = new CreateSettingDto();
    dto.name = 'refresh_rate';
    dto.data_type = DataType.NUMBER;
    dto.value = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('accepts valid boolean value', async () => {
    const dto = new CreateSettingDto();
    dto.name = 'enabled';
    dto.data_type = DataType.BOOLEAN;
    dto.value = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('accepts valid json object value', async () => {
    const dto = new CreateSettingDto();
    dto.name = 'preferences';
    dto.data_type = DataType.JSON;
    dto.value = { layout: 'grid' };

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid enum data_type', async () => {
    const dto = new CreateSettingDto();
    dto.name = 'x';
    dto.data_type = 'invalid' as DataType;
    dto.value = 'abc';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('rejects string value when data_type is number', async () => {
    const dto = new CreateSettingDto();
    dto.name = 'refresh_rate';
    dto.data_type = DataType.NUMBER;
    dto.value = 'sixty';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isValidValue');
  });

  it('rejects non-boolean value when data_type is boolean', async () => {
    const dto = new CreateSettingDto();
    dto.name = 'enabled';
    dto.data_type = DataType.BOOLEAN;
    dto.value = 'true';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isValidValue');
  });

  it('rejects non-object value when data_type is json', async () => {
    const dto = new CreateSettingDto();
    dto.name = 'preferences';
    dto.data_type = DataType.JSON;
    dto.value = '{"layout":"grid"}';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isValidValue');
  });
});
